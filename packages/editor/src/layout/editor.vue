<script lang="ts">
import DraggableWrapper from '@/components/draggableWrapper.vue'
import type { VNode } from 'vue'
import {
  computed,
  defineComponent,
  h,
  provide,
  reactive,
  ref,
  toRefs,
  useTemplateRef,
  watchEffect,
} from 'vue'
import { useApp, useHistory, useState } from '@/store'
import ContainerView from '@/widgets/container.view.vue'
// import viewRender from 'widgets_side/viewRender';
import { useFederatedComponent } from '@sepveneto/mpd-hooks'
import { emitEvt, genDisabled, normalizeStyle } from '@/utils'
import { useRoute } from 'vue-router'
import { useHoverActive } from '@/widgets/hooks'
import VueDraggable from 'vuedraggable'
import CanvasView from '@/widgets/canvas.view.vue'
import { FreeDom, FreeScene } from '@sepveneto/free-dom'
import { useZIndex } from './useZIndex'
import { useConfig } from '@/hooks'

export default defineComponent({
  props: {
    preview: Boolean,
  },
  setup(props) {
    const route = useRoute()

    const state = useState()
    const app = useApp()
    const history = useHistory()
    const { activeUuid, onEnter, onLeave, onDragEnd, onDragStart } = useHoverActive()
    const config = useConfig('page')

    provide('Editor', reactive({
      ...toRefs(props),
      globalConfig: config,

      updateConfig,
    }))

    const mainRef = ref()

    const data = computed({
      get() {
        const list = app.config.body[route.name!] ?? []
        if (props.preview) {
          return list.filter(item => item.isShow !== 0)
        } else {
          return list
        }
      },
      set(val: any) {
        app.config.body[route.name!] = val
      },
    })

    // const selected = ref({} as any)
    const selected = computed(() => app.selected)

    const { Component: ViewRender, errorLoading } = useFederatedComponent(
      app.remoteUrl,
      'widgets',
      './viewRender',
    )

    function onPut(_1: any, _2: any, dom: HTMLElement) {
      // @ts-expect-error: vuedraggable extends dom
      const { _inContainer } = dom.__draggable_context.element
      return !_inContainer || _inContainer === 'outer'
    }
    function handleSelect(data: any) {
      // 不能使用运算展开符，需要确保selected与editor指向同一地址
      // 否则选择后的配置结果无法反应到编辑器和store里
      app.selected = data
      emitEvt('SET_SELECTED', data)
      zIndex.select(data)
      app.selected._fromContainer = false
    }
    function updateConfig(data: any) {
      app.selected = data
      app.selected._fromContainer = false
      // app.updateConfig();
    }

    function renderWrapper(item: any) {
      const operate = h(DraggableWrapper, {
        key: item._uuid,
        dir: 'top',
        name: item._name,
        'data-id': `id-${item._uuid}`,
        active: activeUuid.value === item._uuid || selected.value._uuid === item._uuid,
        disabled: genDisabled(item, 'sort'),
        hide: item.isShow != null && !item.isShow,
        container: ['container', 'swiper'].includes(item._view),
        mask: item._view !== 'container' && item._view !== 'swiper' && item._mask,
        customStyle: item.style,
        onMouseenter: () => onEnter(item._uuid),
        onMouseleave: () => onLeave(),
        onMousedown: () => handleSelect(item),
      }, () => renderChild(item))
      return props.preview
        ? renderPreview(item)
        : layoutMode.value === 'free'
          ? h(FreeDom, {
            'data-id': `id-${item._uuid}`,
            'data-type': 'node',
            active: selected.value._uuid === item._uuid,
            style: { zIndex: item.style.zIndex },
            disabledDrag: genDisabled(item, 'sort'),
            x: item.style.x,
            y: item.style.y,
            w: item.style.width,
            h: item.style.height,
            'onUpdate:x': (val: number) => { item.style.x = val },
            'onUpdate:y': (val: number) => { item.style.y = val },
            'onUpdate:w': (val: number) => { item.style.width = val },
            'onUpdate:h': (val: number) => { item.style.height = val },
          }, () => operate)
          : operate
    }
    function renderPreview(item: any) {
      switch (item._view) {
        case 'swiper':
          return h(ContainerView, { config: item, type: 'swiper', style: normalizeStyle(item.style, layoutMode.value) })
        case 'container':
          return h(ContainerView, { config: item, style: normalizeStyle(item.style, layoutMode.value) })
        default:
          return genRender(item, true)
      }
    }
    function genRender(item: any, isPreview = false) {
      if (item._custom) {
        const options = {
          config: item,
          preview: isPreview,
        }
        return h(CanvasView, isPreview ? { ...options, style: normalizeStyle(item.style, layoutMode.value) } : options)
      } else {
        const options = {
          type: item._view,
          config: item,
          preview: isPreview,
          'onUpdate:config': updateConfig,
        }
        const style = normalizeStyle(item.style, layoutMode.value)
        return ViewRender.value
          ? h(ViewRender.value, isPreview ? { ...options, style } : options)
          : h('div', errorLoading.value ? '加载失败!' : '加载中...')
      }
    }
    function renderChild(item: any) {
      switch (item._view) {
        case 'swiper':
          return h(ContainerView, { config: item, type: 'swiper' })
        case 'container':
          return h(ContainerView, { config: item })
        default:
          return genRender(item)
      }
    }
    function onChange(evt: any) {
      const { added, moved } = evt
      if (added) {
        history.create(`添加-${added.element._name}`)
      }
      if (moved) {
        history.create(`移动-${moved.element._name}`)
      }
    }

    const layoutMode = computed(() => {
      return config.value.layoutMode || 'grid'
    })

    function onDrop(evt: DragEvent) {
      const { offsetX, offsetY } = evt

      const list = data.value
      state.currentElem.style.x = offsetX
      state.currentElem.style.y = offsetY
      list.push(state.currentElem)
      data.value = list
    }

    const sceneRef = useTemplateRef<InstanceType<typeof FreeScene>>('sceneRef')
    const zIndex = useZIndex(sceneRef as any, data, {
      onDelete: (selected) => {
        const currentConfig = app.config.body[route.name!]
        const index = currentConfig.findIndex(item => item._uuid === selected._uuid)
        currentConfig.splice(index, 1)
        history.create(`删除-${selected._name}`)
        app.selected = {}
      },
    })
    watchEffect(() => {
      if (layoutMode.value === 'free') {
        zIndex.init()
      } else {
        zIndex.stop()
      }
    }, { flush: 'post' })

    function renderScene(nodes: () => VNode[]) {
      return h(FreeScene, {
        ref: 'sceneRef',
        key: route.name,
        style: 'width: 375px; height: 100%;',
        height: Number(config.value.size.height),
        'onUpdate:height': (val: number) => {
          config.value.size.height = Math.floor(val)
        },
        width: Number(config.value.size.width),
        'onUpdate:width': (val: number) => { config.value.size.width = Math.floor(val) },
        manualDiff: true,
        disabledBatch: true,
        keyboard: true,
        autoExpand: { height: true },
        onDrop,
      }, nodes)
    }

    return {
      app,
      sceneRef,
      layoutMode,
      renderWrapper,
      data,
      onPut,
      mainRef,
      state,
      onDragStart,
      onDragEnd,
      onDrop,
      onChange,
      renderScene,
    }
  },
  render() {
    if (this.layoutMode !== 'free') {
      return h(VueDraggable, {
        ref: 'mainRef',
        class: 'draggable-box',
        style: 'min-height: calc(667px - 60px); position: relative;',
        modelValue: this.data,
        group: { name: 'widgets', pull: true, put: true },
        componentData: {
          type: 'transition-group',
          name: 'flip-list',
        },
        animation: 200,
        handle: '.operate',
        itemKey: '_uuid',
        'onUpdate:modelValue': (val: any) => { this.data = val },
        onStart: () => { this.state.dragging = true; this.onDragStart() },
        onEnd: () => { this.state.dragging = false; this.onDragEnd() },
        onChange: this.onChange,
      }, {
        item: (item: any) => this.renderWrapper(item.element),
      })
    } else {
      const scene = this.renderScene(() => this.data.map(item => this.renderWrapper(item)))
      return scene
    }
  },
})
</script>

<style lang="scss" scoped>
.draggable-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: max-content;
}
</style>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>

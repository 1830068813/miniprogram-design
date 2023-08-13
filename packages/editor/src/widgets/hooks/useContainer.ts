import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue'
import type { Ref } from 'vue'

const DEFAULT_WIDTH = 375
const DEFAULT_HEIGHT = 0

export function useContainer(
  containerRef: Ref<HTMLElement | undefined>,
  config: Ref<Record<string, any>>,
) {
  const { style, grid } = toRefs(config.value)
  const containerRect = reactive({
    width: ref(DEFAULT_WIDTH),
    height: ref(DEFAULT_HEIGHT),
  })

  const containerWidth = computed(() => {
    const { columnGap = 0 } = style.value
    if (!containerRect.width) return 0
    return containerRect.width - columnGap * (grid.value - 1)
  })
  const cellWidth = computed(() => containerWidth.value / grid.value)

  watch([() => style.value.width, () => style.value.height], () => {
    syncSize()
  }, { flush: 'post' })

  onMounted(() => {
    syncSize()

    // 如果容器没有默认宽度，自动设定为375
    if (!style.value.width) style.value.width = 375
  })

  function syncSize() {
    const { width, height } = containerRef.value?.getBoundingClientRect() ?? {}
    containerRect.width = width ?? 375
    containerRect.height = height ?? 0
  }

  return {
    containerRect,
    cellWidth,
  }
}

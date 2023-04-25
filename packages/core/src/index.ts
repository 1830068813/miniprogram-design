import microApp, { renderApp } from '@micro-zoe/micro-app';
import { nextTick, onMounted, getCurrentInstance, CSSProperties } from 'vue-demi';
import { upgrade } from './upgrade';

export * from './upgrade';

export type EditorConfig = {
  version?: string
  globalConfig: Record<PropertyKey, unknown>
  body: Record<PropertyKey, unknown>
  tabbars?: Record<PropertyKey, unknown>
}

type WidgetType = 'input'
  | 'number'
  | 'checkbox'
  | 'image'
  | 'colorPicker'
  | 'select'
  | 'radioGroup'
  | 'editor'
interface ISchema {
  type: WidgetType
  label: string
  key: string
  link?: Record<string, ISchema[]>
  [attr: string]: any
}
export type EditorSchema = {
  globalConfig: ISchema[]
  [key: string]: ISchema[]
}
export type EditorWidget = {
  _name: string
  _view: string
  _schema: string
  _inContainer?: 'outer' | 'inner'
  style?: Partial<CSSProperties>
  [key: string]: unknown
}
export type EditorRoute = {
  name: string
  path: string
  meta?: Record<PropertyKey, unknown> & { title?: string }
}
export type EditorData = {
  /**
   * 组件视图的可访问地址
   */
  remoteUrl?: string
  /**
   * 编辑器数据
   */
  config: EditorConfig
  /**
   * 组件的配置项
   */
  schema?: EditorSchema
  /**
   * 可配置的组件列表
   */
  widgets?: {
    [key: string]: EditorWidget[]
  }
  /**
   * 编辑器的路由
   */
  routes?: EditorRoute[]
}

export type DesignOptions = {
  url: string
  name: string
  inline: boolean
  data?: EditorData
}
export async function useDesign (
  dom: string | Element,
  options: DesignOptions,
) {
  const { url, inline, name = 'miniprogram-design', data } = options;
  await new Promise((resolve, reject) => {
    tryOnMounted(() => {
      renderApp({
        name,
        url,
        container: dom,
        inline,
        data,
        'clear-data': true,
        'disable-patch-request': true, // 关闭对子应用请求的拦截
      }).then((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('[@sepveneto/mpd-core] 应用加载失败'));
        }
      });
    });
  });

  function set (data: EditorData) {
    const { config } = data;
    if (!config.version) {
      config.version = upgrade.VERSION;
    }
    microApp.setData(name, { ...data, config });
  }
  function get (): EditorConfig | null {
    return microApp.getData(name) as EditorConfig | null;
  }
  return [get, set];
}

function tryOnMounted (fn: () => void) {
  if (getCurrentInstance()) {
    onMounted(fn);
  } else {
    nextTick().then(fn);
  }
}

import './public-path';
import { App, createApp } from 'vue';
import AppVue from './App.vue';
import { createPinia, Pinia } from 'pinia';
import { useApp } from './store';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';

let app: App | null;
let store: Pinia | null;

function mount () {
  console.log('mount');
  app = createApp(AppVue);
  store = createPinia();
  app.use(ElementPlus);
  app.use(store);
  app.mount('#app');

  const appStore = useApp();
  window.microApp?.addDataListener((data: any) => {
    if (!data.config) return;
    appStore.setConfig(data.config, data.widgets, data.schema);
  }, true);
}

function unmount () {
  console.log('trigger');
  app?.unmount();
  store = null;
  app = null;
  window.microApp?.clearDataListener();
}

window.mount = mount;
window.unmount = unmount;
if (window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}

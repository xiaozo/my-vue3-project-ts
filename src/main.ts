import { createSSRApp } from "vue";
import App from "./App.vue";
import uViewPro from 'uview-pro'
import store from './store' // store
export function createApp() {
  
  const app = createSSRApp(App);
  app.use(store)
  app.use(uViewPro)
  return {
    app,
  };
}

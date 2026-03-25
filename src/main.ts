import { createSSRApp } from "vue";
import App from "./App.vue";
import uViewPro from 'uview-pro'

import { install } from './app'

export function createApp() {

  const app = createSSRApp(App);

  app.use(uViewPro)
  install(app)
  return {
    app,
  };
}

import type { App } from 'vue';
import store from '@/store' // store
import hasPermi from './directives/hasPermi';
export function install(app: App) {
  // 在这里可以注册全局组件、指令、插件等
  // 例如：
  // app.component('MyComponent', MyComponent)
  // app.directive('focus', focusDirective)
  // app.provide('key', value)
  
   app.use(store)
   ///注册全局指令
   app.directive('hasPermi', hasPermi)
}
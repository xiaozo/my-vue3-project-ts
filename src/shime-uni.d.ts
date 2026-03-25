export {}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}

 // 1. 先导入 Vue 的原始类型
  export interface ComponentCustomProperties {
    $hasPermission: (permission:  string[]) => boolean;
    
    // $router, $route, $store 等仍然存在
  }
}
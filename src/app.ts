import type { App } from 'vue';
import store, { useUserStore } from '@/store';
import * as modal from '@/utils/modal';
export function install(app: App) {
  
  
   app.use(store)

   const userStore = useUserStore()
   app.config.globalProperties.$hasPermission = userStore.hasPermission
     // 模态框对象
  app.config.globalProperties.$modal = modal
  console.log("app.ts",modal);
  
} 
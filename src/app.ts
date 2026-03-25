import type { App } from 'vue';
import store, { useUserStore } from '@/store';
export function install(app: App) {
  
  
   app.use(store)

   const userStore = useUserStore()
   app.config.globalProperties.$hasPermission = userStore.hasPermission
} 
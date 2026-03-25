// stores/user.ts
import { ref, computed, reactive } from 'vue';
import { getToken } from '@/api/utils'

// 使用简单的 reactive 状态管理而不是 pinia
export function useUserStore() {
  // State
  const user = ref<MODEL.UserInfo | null>(null);
  const token = ref<string>('');
  const permissions = reactive<string[]>([]);
  const isLoading = ref(false);
  
  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const userName = computed(() => user.value?.userName ?? '');
  const hasPermission = computed(() => (permission: string) => 
    permissions.includes(permission)
  );
  
  // Actions
  async function login(credentials: { username: string; password: string }) {
    isLoading.value = true;
    
  }
  
  function logout() {
    user.value = null;
    token.value = '';
    permissions.splice(0, permissions.length);
    localStorage.removeItem('token');
  }
  
  return {
    // State
    user,
    token,
    permissions,
    isLoading,
    
    // Getters
    isLoggedIn,
    userName,
    hasPermission,
    
    // Actions
    login,
    logout,
  };
}
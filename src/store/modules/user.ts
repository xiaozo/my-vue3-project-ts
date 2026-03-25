import { ref, computed, type Ref } from 'vue';
import { getToken, removeToken, setToken } from '@/api/utils'
import { useLocalStorageRef } from '@/utils'
import { defineStore } from 'pinia'
import { login, getCodeImg, getInfo, logout } from '@/api/login';

// 使用 defineStore 包装你的逻辑
export const useUserStore = defineStore('user', () => {
  // --- State ---
  const user: Ref<MODEL.UserInfo | null> = useLocalStorageRef('user', null);
  const token = ref<string>(getToken());
  const roles = useLocalStorageRef('roles', []);
  const permissions = useLocalStorageRef('permissions', []);

  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value);
  const hasPermission = computed(() => (permissions: string[]) =>
    checkPermi(permissions)
  );
  ///是否有角色
  const hasRole = computed(() => (roles: string[]) =>

    checkRole(roles)

  );


  // --- Actions ---
  function loginAction(params: LoginParams): Promise<LoginRes> {
    // 这里保留你原来的空实现，后续你自己填充逻辑
    return new Promise<LoginRes>((resolve, reject) => {
      login({
        params,
        options: {
          showLoading: true
        }
      }).then((res: LoginRes) => {
        setToken(res.token)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })


  }



  // 获取用户信息
  const getInfoAction = (): Promise<GetInfoRes> => {
    return new Promise<GetInfoRes>((resolve, reject) => {
      getInfo({}).then((res: GetInfoRes) => {
        const { user: tuser } = res
        console.log("getInfo res", res)
        let avatar = tuser.avatar || ""
        const userId = tuser.userId || ""
        const userName = tuser.userName || ""
        user.value = {
          avatar,
          userId,
          userName
        };

        roles.value = res.roles;

        permissions.value = res.permissions;

        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }

  function logoutAction(): Promise<any> {
    ///请求退出接口
    return new Promise((resolve, reject) => {

      logout({
         options: {
          showLoading: true
        }
      }).then(() => {
        user.value = null
        token.value = ''
        roles.value = []
        permissions.value = []
        removeToken()
        resolve(true)

      }).catch(error => {

        reject(error)

      })

    })

  }

  /**
   * 校验用户是否拥有某权限
   * @param value 权限列表，例如 ['system:user:add']
   * @returns boolean
   */
  function checkPermi(value: string[]): boolean {
    // 1. 验证输入参数是否合法
    if (value && Array.isArray(value) && value.length > 0) {
      // 这里的 permissions 应该从你的 Pinia Store 中获取
      // 假设你已经定义了 store：const userStore = useUserStore()
      // 注意：不要在函数内部用 permissions = permissions.value，会报错
      const userPermissions: string[] = permissions.value;

      const permissionDatas = value;
      const ALL_PERMISSION = "*:*:*";

      // 2. 判定逻辑
      const hasPermission = userPermissions.some(permission => {
        return ALL_PERMISSION === permission || permissionDatas.includes(permission);
      });

      return hasPermission;
    } else {
      console.error(`[Permission Error]: need roles! Like checkPermi="['system:user:add','system:user:edit']"`);
      return false;
    }
  }

  /**
 * 校验用户是否拥有角色
 * @param value 角色列表
 */
  function checkRole(value: string[]): boolean {
    if (value && Array.isArray(value) && value.length > 0) {
      // 假设 roles 来自你的 store 状态
      const userRoles: string[] = roles.value;
      const permissionRoles = value;
      const super_admin = "admin";

      const hasRole = userRoles.some(role => {
        return super_admin === role || permissionRoles.includes(role);
      });

      if (!hasRole) {
        return false;
      }
      return true;
    } else {
      console.error(`need roles! Like checkRole="['admin','editor']"`);
      return false;
    }
  }

  // 返回所有属性和方法
  return {
    user,
    token,
    permissions,
    isLoggedIn,
    hasRole,
    hasPermission,
    login: loginAction,
    getInfo: getInfoAction,
    logout: logoutAction
  };
});
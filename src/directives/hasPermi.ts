import { useUserStore } from '@/store/modules/user';
import type { Directive, DirectiveBinding } from 'vue';

/**
 * 用户权限处理指令
 */
const hasPermi: Directive = {
  // 在绑定元素的父组件挂载后调用
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const userStore = useUserStore();
    
    // 调用你在 Store 里写好的逻辑
    if (!userStore.hasPermission(value)) {
      // 如果没有权限，直接从 DOM 中移除该元素
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};

export default hasPermi;
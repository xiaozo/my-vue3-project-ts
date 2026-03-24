import type { Ref } from 'vue';

/**
 * MyPaging 组件 ref 类型
 * 基于 z-paging 的二次封装组件
 */
declare global {
  /**
   * MyPaging 组件实例类型
   */
  interface MyPagingRef{
    /** 当前页码 */
    pageNo: number;
    
    /** 当前分页参数 */
    _options: any;
    
    /** 重新加载数据 */
    reload: (data?: any) => void;
    
    /** 完成分页请求 */
    complete: (data?: any[] | false) => void;
    
    /** 结束下拉刷新 */
    endRefresh: () => void;
    
    /** 设置导航栏标题 */
    setNavigationBarTitle: (title: string) => void;
    
    /** 绑定的内部 z-paging 实例 */
    $refs?: {
      paging: {
        pageNo: number;
      };
    };
  }
}
export {}
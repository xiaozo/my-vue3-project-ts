export {}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks { }



  // 1. 先导入 Vue 的原始类型
  export interface ComponentCustomProperties {

    $hasPermission: (permissions: string[]) => boolean;
    $modal: {
      msgToast: (content: string) => void;
      msgErrorToast: (content: string) => void;
      msgSuccessToast: (content: string) => void;
      hideMsg: () => void;
      alert: (content: string, title?: string) => void;
      confirm: (content: string, title?: string) => Promise<boolean>;
    };

  }

}

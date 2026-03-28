/// <reference types='@dcloudio/types' />
import 'vue'

// 添加 crypto-js 的类型声明
declare module 'crypto-js' {
  const MD5: any;
  const HmacSHA256: any;
  const enc: {
    Base64: {
      stringify: (wordArray: any) => string;
      parse: (base64Str: string) => any;
    };
    Utf8: {
      parse: (str: string) => any;
    };
  };
}

declare module '@vue/runtime-core' {
  type Hooks = App.AppInstance & Page.PageInstance;

  interface ComponentCustomOptions extends Hooks {

  }
}

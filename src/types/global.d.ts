/**
 * uni-app PagesJSON 类型扩展
 */
  interface PagesJson {
    pages: Array<{
      path: string;
      style?: {
        navigationBarTitleText?: string;
        navigationBarBackgroundColor?: string;
        navigationBarTextStyle?: 'black' | 'white';
        navigationStyle?: 'default' | 'custom';
        backgroundColor?: string;
      };
    }>;
    globalStyle?: {
      navigationBarTextStyle?: 'black' | 'white';
      navigationBarTitleText?: string;
      navigationBarBackgroundColor?: string;
      backgroundColor?: string;
      navigationStyle?: 'default' | 'custom';
    };
    easycom?: {
      custom?: {
        [pattern: string]: string;
      };
    };
    subPackages?: Array<{
      root: string;
      pages: Array<{
        path: string;
        style?: Record<string, any>;
      }>;
    }>;
  }

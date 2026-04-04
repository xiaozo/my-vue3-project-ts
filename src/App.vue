<script lang="ts">
// 定义全局数据
export default {
  globalData: {
    data: {
      showCustomNavBar: true,
      navDark: false,
      navTitleFontSize: '32rpx'
    },
    pagesItems: {},
  },
};
</script>
<script setup lang="ts">
import { onLaunch, onShow, onHide, onError } from "@dcloudio/uni-app";

import pagesJson from '@/pages.json'
import { getCurrentInstance, type ComponentInternalInstance } from "vue";

///快速获取标题
const pagesItems = () => {

  let { pages, subPackages } = pagesJson as PagesJson;
  const items: any = {};
  const prefix = ''
  ///处理主包
  pages?.forEach((element: any) => {
    const path = `${prefix}${element.path}`;
    const style = element.style;
    items[path] = style;
  });

  subPackages?.forEach((element: any) => {
    const { root, pages } = element;
    pages.forEach((element: any) => {
      const path = `${prefix}${root}/${element.path}`;
      const style = element.style;
      items[path] = style;
    });
  });
  console.log("pagesItems", items);

  return items;
};

onLaunch(() => {
  const instance = getCurrentInstance() as ComponentInternalInstance;
  const app = instance?.proxy as AnyObject;
  app.globalData.pagesItems = pagesItems();

});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
onError(() => {
  console.log("App Error");
})
</script>


<style lang="scss">
// @import "uview-pro/index.scss";
@import "./static/scss/variables/variables.scss";
</style>

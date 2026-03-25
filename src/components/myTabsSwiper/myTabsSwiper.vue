<template>
  <z-paging-swiper>
    <template #top>
      <custom-navbar ref="customNavbar" v-if="navBar" :fixed="false" :dark="navDark" :titleFontSize="navTitleFontSize"
        statusBar>
      </custom-navbar>
      <slot name="topTop"></slot>
      <z-tabs class="tabs" :class="HiddenTabs ? 'none' : ''" ref="tabs"
        :active-color="APPconfig.configColor.colorPrimary" inactive-color="#ABABAB" :list="tabList"
        :current="currentData.current" @change="tabsChange" :tab-width="tabWidth" />
    </template>
    <swiper class="swiper" :current="currentData.current" @transition="swiperTransition"
      @animationfinish="swiperAnimationfinish">
      <swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
        <view class="content">
          <!-- #ifdef H5 || APP-PLUS -->
          <slot :name="index"></slot>
          <!-- #endif -->
          <!-- #ifdef MP -->
          <slot name="{{index}}"> </slot>
          <!-- #endif -->
        </view>
      </swiper-item>
    </swiper>
    <!-- <view v-for="item in list" :key="item">
      <slot :text="item"></slot>
    </view> -->
  </z-paging-swiper>
</template>
<script>
const app = getApp();
export default {
  props: {
    ////是否显示navbar
    navBar: {
      type: Boolean,
      default: () => {
        return app.globalData.data.showCustomNavBar;
      },
    },
    ////自定义nav里的dark属性
    navDark: {
      type: Boolean,
      default: () => {
        return app.globalData.data.navDark;
      },
    },
    ///自定义导航栏标题size
    navTitleFontSize: {
      type: String,
      default: () => {
        return app.globalData.data.navTitleFontSize;
      },
    },
    Current: {
      type: Number,
      default: 0,
    },
    TabList: {
      type: Array,
      default: () => [],
    },
    HiddenTabs: {
      type: Boolean,
      default: false,
    },
    tabWidth: {
      type: Number | String,
      default: 0,
    },
  },
  watch: {
    TabList: {
      handler(val) {
        this.tabList = val;
      },
      immediate: true,
      deep: true,
    },
    Current: {
      handler(val) {
        this.currentData.current = val;
      },
      immediate: true,
    },
  },
  data() {
    return {
      currentData: { current: this.Current },
      tabList: this.TabList,
    };
  },
  methods: {
    //tabs通知swiper切换
    tabsChange(index) {
      this.currentData.current = index;
      console.log("tabsChange");
      this.$emit("tabsChange", this.currentData.current);
      this.$emit("update:Current", this.currentData.current);
    },
    //swiper滑动中
    swiperTransition(e) {
      //   console.log("swiperTransition");
      this.$refs.tabs.setDx(e.detail.dx);
    },
    //swiper滑动结束
    swiperAnimationfinish(e) {
      this.currentData.current = e.detail.current;

      this.$refs.tabs.unlockDx();
      this.$emit("tabsChange", this.currentData.current);
      this.$emit("update:Current", this.currentData.current);
    },
    setNavigationBarTitle(title) {
      if (!!this.navBar) {
        this.$refs.customNavbar.setTitle(title)
      } else {
        uni.setNavigationBarTitle({
          title,
        });
      }
    }
  },
  beforeMount() {
    this.tabList = this.TabList;
  },
  mounted() {
    const app = getApp();
    if (!!this.navBar) {
      ///如果是自定义导航栏设置标题
      const pagesItems = app.globalData.pagesItems;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const title = pagesItems[currentPage.route]?.navigationBarTitleText;
      if (!!title) {
        this.setNavigationBarTitle(title)
      }
    }
  },
};
</script>
<style scoped lang="scss">
.tabs.none {
  display: none !important;
}

.swiper {
  height: 100%;

  .content {
    height: 100%;
  }
}
</style>

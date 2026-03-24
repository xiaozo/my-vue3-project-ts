<!-- 基于z-paging封装个性化分页组件演示，可减少大量重复代码\
https://z-paging.zxlee.cn/start/migration-to-vue3.html
https://z-paging.zxlee.cn/start/intro.html -->

<template>
  <!-- 这边统一设置z-paging，在页面中使用时就不用重复写 -->
  <!-- 如果要在这里设置极简写法，这里的ref不能设置为paging，设置为其他名即可，因为极简写法会修改/调用第一个包含了ref="paging"的付view中的list和query -->
  <!-- 极简写法在下方设置autowire-list-name="xxx" autowire-query-name="xxx"即可，与minimalism-demo.vue中的一致，并且不用再从这个组件转发到页面，只要遵循上一行的规则即可 -->
  <z-paging ref="paging" v-model="list" :auto-show-back-to-top="false" refresher-threshold="160rpx" @query="myqueryList"
    :useVirtualList="useVirtualList" :useInnerList="useInnerList" :cellKeyName="cellKeyName"
    :innerListStyle="innerListStyle" :preloadPage="preloadPage" :cellHeightMode="cellHeightMode"
    :virtualScrollFps="virtualScrollFps" :refresher-enabled="refresherEnabled"
    :loading-more-enabled="loadingMoreEnabled" :hide-empty-view="!ShowEmptyView"
    :auto-show-system-loading="autoShowSystemLoading"
    :auto-hide-loading-after-first-loaded="AutoHideLoadingAfterFirstLoaded" :fixed="fixed"
    :show-empty-view-reload="showEmptyViewReload" :auto="false" :empty-view-text="emptyViewText"
    :empty-view-error-text="errorMsg" @scroll="mySroll" @scrolltoupper="myScrolltoupper" >
    <!-- 这里插入一个view到z-paging中，并且这个view会被z-paging标记为top固定在顶部 -->

    <template #top>
      <custom-navbar ref="customNavbar" v-if="navBar" :fixed="false" :dark="navDark" :titleFontSize="navTitleFontSize"
        statusBar>
      </custom-navbar>
      <!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="top"了 -->
      <slot name="top" />
    </template>

    <!-- 这里插入一个view到z-paging中，并且这个view会被z-paging标记为bottom固定在顶部 -->
    <template #bottom>
      <!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="bottom"了 -->
      <slot name="bottom" />
    </template>

    <template #loading>
      <!-- 这里接收页面传进来的slot，这样相当于将页面传进来的slot传给z-paging的slot="loading"了 -->
      <!-- <slot name="loading" /> -->
      <view class="loading">
        <image
          class="img"
          style="height: 90rpx; width: 90rpx"
          src="/static/logo.png"
        />
        <view class="text">海风吹啊吹</view>
      </view>
    </template>

    <!-- 这个是插入虚拟列表/内置列表的cell -->
    <template #cell="{ item, index }">
      <slot name="cell" :item="item" :index="index" />
    </template>

    <!-- 这里接收页面传进来的普通slot，如列表数据等 -->
    <block v-if="!!errorNoLoadView">
      <slot v-if="LoadDataSuccess" />
    </block>
    <block v-else>
      <slot />
    </block>
  </z-paging>
</template>

<script>
const app = getApp();

export default {
  ///禁用自动继承
  inheritAttrs: false,
  name: "my-paging",
  data() {
    return {
      list: [],
      ShowEmptyView: false,
      LoadDataSuccess: false, ///是否数据载入成功，如果为false则根据情况显示空视图
      LoadingMoreEnabled: false,
      errorMsg: "很抱歉，加载失败",
      AutoHideLoadingAfterFirstLoaded: true,
      _options: {}
    };
  },
  props: {
    ///第一次加载后自动隐藏loading slot
    // autoHideLoadingAfterFirstLoaded: {
    //   type: Boolean,
    //   default: true,
    // },
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
    ///空数据的文案
    emptyViewText: {
      type: String,
      default: "暂无数据",
    },
    //错误时候是否载入<slot> 默认是错误不载入<slot>
    errorNoLoadView: {
      type: Boolean,
      default: true,
    },
    ///是否自动显示系统Loading：即uni.showLoading，若开启则将在刷新列表时(调用reload、refresh时)显示，下拉刷新和滚动到底部加载更多不会显示
    autoShowSystemLoading: {
      type: Boolean,
      default: false,
    },
    //用于接收父组件v-model所绑定的list的值
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
    ///是否开启下拉刷新
    refresherEnabled: {
      type: Boolean,
      default: true,
    },
    ///是否加载更多
    loadingMoreEnabled: {
      type: Boolean,
      default: false,
    },
    ///是否加载数据成功
    loadDataSuccess: {
      type: Boolean,
      default: true,
    },
    //是否显示空数据图重新加载按钮(无数据时)/
    showEmptyViewReload: {
      type: Boolean,
      default: true,
    },
    ///z-paging是否使用fixed布局，若使用fixed布局，则z-paging的父view无需固定高度，z-paging高度默认铺满屏幕，页面中的view请放在z-paging标签内，需要固定在顶部的view使用slot="top"包住，需要固定在底部的view使用slot="bottom"包住。
    fixed: {
      type: Boolean,
      default: true,
    },
    ///mounted后自动调用reload方法
    auto: {
      type: Boolean,
      default: true,
    },
    //是否隐藏空页面
    hideEmptyView: {
      type: Boolean,
      default: false,
    },
    //是否使用虚拟列表，默认为否
    useVirtualList: {
      type: Boolean,
      default: false,
    },
    //是否在z-paging内部循环渲染列表(内置列表)，默认为否。若use-virtual-list为true，则此项恒为true
    useInnerList: {
      type: Boolean,
      default: false,
    },
    //内置列表cell的key名称，仅nvue有效，在nvue中开启use-inner-list时必须填此项
    cellKeyName: {
      type: String,
      default: "",
    },
    //innerList样式
    innerListStyle: {
      type: Object,
      default: function () {
        return {};
      },
    },
    //预加载的列表可视范围(列表高度)页数，默认为7，即预加载当前页及上下各7页的cell。此数值越大，则虚拟列表中加载的dom越多，内存消耗越大(会维持在一个稳定值)，但增加预加载页面数量可缓解快速滚动短暂白屏问题
    preloadPage: {
      type: [Number, String],
      default: 7,
    },
    //虚拟列表cell高度模式，默认为fixed，也就是每个cell高度完全相同，将以第一个cell高度为准进行计算。可选值【dynamic】，即代表高度是动态非固定的，【dynamic】性能低于【fixed】。
    cellHeightMode: {
      type: String,
      default: "fixed",
    },
    //虚拟列表scroll取样帧率，默认为60，过高可能出现卡顿等问题
    virtualScrollFps: {
      type: [Number, String],
      default: 60,
    },
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

    ///处理网络错误
    this.netErrorHandle = function (data) {
      let { page, msg } = data;

      if (!!page?.$refs?.paging && page?.$refs?.paging == this) {
        ///是当前页面才调用error
        this.error(msg);
      }
    }.bind(this);
    uni.$on("net-error", this.netErrorHandle);

    ///处理网络成功
    this.netSuccessHandle = function (data) {
      let { page } = data;
      if (!!page?.$refs?.paging && page?.$refs?.paging == this) {
        ///是当前页面才调用success
        this.success();
      }
    }.bind(this);
    uni.$on("net-success", this.netSuccessHandle);

    this.LoadingMoreEnabled = this.loadingMoreEnabled;
    this.LoadDataSuccess = this.loadDataSuccess;

  },
  destroyed() {
    uni.$off("net-error", this.netErrorHandle);
    uni.$off("net-success", this.netSuccessHandle);
  },
  watch: {
    //监听页面v-mode传过来的值，同时传给z-paging
    value(newVal) {
      this.list = newVal;
    },
    //监听z-paging给当前组件的值，同时传给页面
    list(newVal) {
      //通过emit input修改页面中v-model绑定的值
      this.$emit('update:modelValue', newVal);
    },
    loadingMoreEnabled(newVal) {
      this.LoadingMoreEnabled = newVal;
    },
    loadDataSuccess(newVal) {
      this.LoadDataSuccess = newVal;
    },
    LoadDataSuccess(newVal) { },
  },
  methods: {
    ///展示空视图
    isShowEmptyView(showEmptyView) {
      this.ShowEmptyView = !this.hideEmptyView ? showEmptyView : false;
    },
    ///结束上拉刷新
    endRefresh() {
      this.$refs.paging.endRefresh();
    },
    //监听z-paging的@query事件，通过emit传递给页面
    myqueryList(pageNo, pageSize) {
      if (pageNo == 1) {
        this.$emit("pageLoad", this._options);
      }
      this.$emit("query", pageNo, pageSize);
    },
    mySroll(e) {
      this.$emit("scroll", e);
    },
    myScrolltoupper(e) {
      this.$emit("scrolltoupper");
    },
    //接收页面传递过来的reload事件，传给z-paging
    reload(data) {
      // this.setAutoShowSystemLoading(false)
      this.$refs.paging.reload(data);
    },
    //接收页面传递过来的complete事件，传给z-paging
    complete(data) {
      this.isShowEmptyView(Array.isArray(data));

      ///如果数据是的话，则AutoHideLoadingAfterFirstLoaded=false
      this.AutoHideLoadingAfterFirstLoaded = !Array.isArray(data);

      this.$refs.paging.complete(data);
    },
    ///请求错误处理
    error(err) {
      if (this.$refs?.paging.pageNo == 1) {
        this.LoadDataSuccess = this.hideEmptyView;
        this.isShowEmptyView(true);
        this.errorMsg = err;
        this.$refs.paging.complete(false);
      }
    },
    ///请求成功处理
    success() {
      if (this.$refs?.paging.pageNo == 1 && !this.LoadDataSuccess) {
        this.LoadDataSuccess = true;
        this.isShowEmptyView(false);
      }
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
    /*
      //如果是使用页面滚动，则需要添加以下两行，注意页面那边要引入mixins，与使用页面滚动示例写法相同。
      //接收页面传递过来的updatePageScrollTop事件，传给z-paging
      updatePageScrollTop(data){
        this.$refs.paging.updatePageScrollTop(data);
      },
      //接收页面传递过来的doLoadMore事件，传给z-paging
      doLoadMore(){
        this.$refs.paging.doLoadMore();
      }
      */
  },
};
</script>

<style lang="scss" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(1080deg);
  }
}

.loading {
  z-index: 999;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .img {
    animation-name: rotate;
    animation-duration: 2s;
    /* 动画开始快，结束慢 */
    animation-timing-function: ease-in-out;
    /* 缓动函数 */
    animation-iteration-count: infinite;
    /* 无限循环 */
    background-color: transparent;
  }

  .text {
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #999;
    text-align: center;
  }
}
</style>

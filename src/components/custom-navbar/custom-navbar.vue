<template>
  <!-- <u-navbar :title="title" :fixed="fixed" :is-back="false" :title-color=fontColor :title-size="TitleFontSize"
    :background="{
      backgroundColor: '#8D2160'
    }">
    <template slot="left">
      <custom-navback v-if="!$slots.left" :dark="dark" />

      <view v-else>
        <slot name="left" />
      </view>
    </template>
<template #right>
      <slot name="right" />
    </template>
</u-navbar> -->

  <wd-navbar  :fixed="fixed" safeAreaInsetTop :custom-style="`background-color: #8D2160;`">
    <template #left>
      <view v-if="!$slots.left">
        <custom-navback :dark="dark" />
      </view>

      <view v-else>
        <slot name="left" />
      </view>
    </template>
    <template slot="title">
      <text :style="{ fontSize: TitleFontSize, color: fontColor }">{{ title }}</text>
    </template>
    <template #right>
      <slot name="right" />
    </template>
  </wd-navbar>
</template>
<script>
export default {
  components: {},
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    statusBar: {
      type: Boolean,
      default: false,
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    titleFontSize: {
      type: String,
      default: "14px",
    },
  },
  computed: {
    fontColor() {
      // 优先使用传入的颜色，否则根据 dark 模式自动切换
      return (this.dark ? "#000" : "#fff");
    },
    TitleFontSize() {
      // 转为字符串
      const strValue = this.titleFontSize
      // 匹配数字和单位
      const match = strValue.match(/^(\d+(?:\.\d+)?)(px|rpx)?$/i)

      if (!match) {
        return strValue
      }

      const [, num, unit] = match

      return unit == "px" ? `${num * 2}` : `${num}`;
    },
  },
  data() {
    return {
      title: "",
    };
  },
  mounted() { },
  destroyed() { },
  methods: {
    setTitle(title) {
      this.title = title;
    },
    backAction() {
      const pages = getCurrentPages();
      if (pages.length <= 1) {
        this.indexAction();
        return;
      }
      uni.navigateBack();
    },
    indexAction() {
      uni.switchTab({
        url: "/pages/index/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>

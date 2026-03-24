<template>
  <u-navbar :title="title" :fixed="fixed" :is-back="false" :title-color=fontColor :title-size="TitleFontSize"
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
  </u-navbar>
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
      return this.dark ? "#000" : "#fff";
    },
    TitleFontSize() {
      console.log("TitleFontSize", this.titleFontSize);

      // 转为字符串
      const strValue = this.titleFontSize
      // 匹配数字和单位
      const match = strValue.match(/^(\d+(?:\.\d+)?)(px|rpx)?$/i)

      if (!match) {
        // 如果不符合格式，返回原始值
        return strValue
      }

      const [, num, unit] = match

      return unit == "px" ? `${num * 2}` : `${num}`;

    }
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

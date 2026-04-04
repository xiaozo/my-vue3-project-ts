<template>
  <view class="u-nav-slot">
    <view class="ba-px-4 ba-py-2" @click.stop="backAction"  v-if="showBack">
      <wd-icon name="arrow-left" size="25px" :color="fontColor"></wd-icon>
    </view>
    <ba-line
      v-if="showBack"
      direction="column"
      :hairline="false"
      length="18px"
      margin="0"
    ></ba-line>
    <view class="ba-px-4 ba-py-2" @click.stop="indexAction">
      <wd-icon name="home" size="25px" :color="fontColor"></wd-icon>
    </view>
  </view>
</template>
<script>
export default {
  components: {},
  props: {
    dark: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "",
    }
  },
  computed: {
    fontColor() {
      if (!!this.color) {
        return color;
      }

      return this.dark ? "#000" : "#fff";
    },
  },
  data() {
    return {
      showBack: true,
    };
  },
  mounted() {
    var pages = getCurrentPages();
    this.showBack = pages.length > 1;
  },
  destroyed() {},
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
<style lang="scss" scoped>
.u-nav-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 200rpx;
  border: 0.5px solid #dadbde;
  padding: 0;
  opacity: 0.8;
  line-height: normal;
}
</style>

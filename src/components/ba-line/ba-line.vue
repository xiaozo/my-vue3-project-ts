<template>
  <view
    class="ba-line"
    :class="[`ba-line--${direction}`, { 'ba-line--hairline': hairline }]"
    :style="lineStyle"
  ></view>
</template>

<script>
export default {
  name: 'ba-line',
  props: {
    // 方向：row(水平) / column(垂直)
    direction: {
      type: String,
      default: 'row'
    },
    // 是否使用细线
    hairline: {
      type: Boolean,
      default: true
    },
    // 长度，支持 rpx/px
    length: {
      type: [String, Number],
      default: '100%'
    },
    // 边距
    margin: {
      type: [String, Number],
      default: 0
    },
    // 颜色
    color: {
      type: String,
      default: '#eaeaea'
    },
  },
  computed: {
    lineStyle() {
      const isColumn = this.direction === 'column';
      const marginValue = typeof this.margin === 'number' ? `${this.margin}rpx` : this.margin;

      return {
        backgroundColor: this.color,
        ...(isColumn
          ? {
              width: '1px',
              height: this.length,
              marginLeft: marginValue,
              marginRight: marginValue
            }
          : {
              height: '1px',
              width: this.length,
              marginTop: marginValue,
              marginBottom: marginValue
            })
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.ba-line {
  flex-shrink: 0;
}

.ba-line--row {
  display: block;
  overflow: hidden;
}

.ba-line--column {
  display: inline-block;
}

.ba-line--hairline.ba-line--row {
  transform: scaleY(0.5);
}

.ba-line--hairline.ba-line--column {
  transform: scaleX(0.5);
}
</style>

<template>
  <view>
    <view class="top" v-if="topShow" @click="goTop()">
      <uni-icons type="navigate-filled" :size="55" color="#2b85e4" />
    </view>
  </view>
</template>

<script>
  export default {
    name: "viewTop",
    data() {
      return {
        topShow: false,
      };
    },
    props: {
      scrollTop: {
        type: Number,
        default: 0
      },
    },

    methods: {
      topData(e) {
        //这个e直接是滚动时候的高度
        this.topShow = e > 390
      },
      goTop() {
        uni.pageScrollTo({
          scrollTop: this.scrollTop,
          duration: 300
        });
      },
    }
  }
</script>

<style lang="scss">
  .top {
    height: 70rpx;
    width: 70rpx;
    text-align: center;
    line-height: 70rpx;
    border-radius: 50%;
    background-color: rgba($color: #FFFFFF, $alpha: 0.8);
    display: flex;
	justify-content: center;
    position: fixed;
    z-index: 999;
    // 距离右边
    right: 25rpx;
    // 距离底部距离
    bottom: 150rpx;
    animation: heart 0.3s;

    @keyframes heart {
      0% {
        right: -30rpx;
      }

      100% {
        right: 30rpx;
      }
    }
  }
</style>
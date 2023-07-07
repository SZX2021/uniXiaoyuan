<template>
  <view style="display: flex;flex-direction: column;">
    <swiper autoplay circular class="lunbotu">
      <swiper-item v-for="(item,index1) in swiper" :key="index1">
        <image :src="item"></image>
      </swiper-item>
    </swiper>

    <uni-segmented-control :current="current" :values="items" styleType="text" @clickItem="onClickItem" />
    <view class="article">
      <contentCard v-show="items[current]==='全部'" :contentList="allArticles" :category="items[current]" />
      <contentCard v-show="items[current]==='日常'" :contentList="dailyArticles" :category="items[current]"/>
      <contentCard v-show="items[current]==='吐槽'" :contentList="rantArticles" :category="items[current]"/>
      <contentCard v-show="items[current]==='集市'" :contentList="bazaarArticles" :category="items[current]"/>
      <contentCard v-show="items[current]==='失物招领'" :contentList="lostFoundArticles" :category="items[current]"/>
      <view style="width: 100%;height: 200rpx; padding-top: 22rpx;">
        <P style="font-size: 20rpx; color: #888888;display: flex;justify-content: center;height: 200rpx;">
          人家也是有底线的，怎么刷都没有了哦~</P>
      </view>
    </view>

    <totop ref="VT" :scrollTop="top"></totop>
    <zdy-tabbar :current-page="0"></zdy-tabbar>
  </view>
</template>

<script>
  import contentCard from '@/components/content-card.vue'
  import store from '../../store';
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  export default {
    components: {
      contentCard
    },
    data() {
      return {
        items: ['全部', '日常', '吐槽', '集市', '失物招领'],
        current: 0,
        scrollTopList: [0, 0, 0, 0, 0],
      }
    },
    onLoad() {
      uni.showLoading({
        title: '加载中...'
      });
      this.getSwiper();
      this.getArticle();
      uni.hideLoading();

      this.getArticle("日常");
      this.getArticle("吐槽");
      this.getArticle("集市");
      this.getArticle("失物招领");
      this.fetchArticleTotalNum();
    },
    onPageScroll(e) {
      // 更新保存的滚动条位置
      this.scrollTopList[this.current] = e.scrollTop;
      //调用返回顶部组件内方法
      this.$refs.VT.topData(e.scrollTop);
    },
    onReachBottom() {
      this.getArticle(this.items[this.current]);
    },
    computed: {
      ...mapGetters([
        'allArticles',
        'dailyArticles',
        'rantArticles',
        'bazaarArticles',
        'lostFoundArticles',
      ]),
      //检查数据是否有，没有一直显示加载中。。。
      swiper() {
        return store.state.swiper
      },

    },
    methods: {
      ...mapActions([
        'getArticle',
        'fetchArticleTotalNum',
        'getSwiper',
      ]),
      onClickItem(e) {
        uni.pageScrollTo({
          scrollTop: this.scrollTopList[e.currentIndex],
          duration: 0
        });
        if (this.current !== e.currentIndex) {
          this.current = e.currentIndex
        };
      }

    }
  }
</script>

<style scoped>
  .lunbotu {
    width: 90%;
    border-radius: 20rpx;
    background-color: white;
    align-self: center;
  }

  .lunbotu image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20rpx;
  }

  swiper-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  swiper-item image {
    max-width: 100%;
    max-height: 100%;
  }

  uni-segmented-control {
    position: sticky;
    top: 0;
    background-color: #f8f8f8;
    z-index: 999;
  }
</style>
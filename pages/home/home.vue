<template>
	<view style="display: flex;flex-direction: column;">
		<swiper autoplay circular class="lunbotu">
			<swiper-item v-for="(item,index1) in swipers " :key="index1">
				<image :src="item"></image>
			</swiper-item>
		</swiper>

		<uni-segmented-control :current="current" :values="items" styleType="text" @clickItem="onClickItem" />
		<view class="article">
			<view class="" v-for="(itme,index) in items" :key="index">
				<contentCard v-if="current===index" :contentList="cardList" />
			</view>
			<view style="width: 100%;height: 200rpx; padding-top: 22rpx;">
				<text
					style="font-size: 20rpx; color: #888888;display: flex;justify-content: center;">人家也是有底线的，怎么刷都没有了哦~</text>
			</view>
		</view>

		<zdy-tabbar :current-page="0"></zdy-tabbar>
	</view>
</template>

<script>
	import contentCard from '@/components/content-card.vue'
	const db = uniCloud.database();
	const dbCmd = db.command;
	export default {
		components: {
			contentCard
		},
		data() {
			return {
				items: ['全部', '日常', '集市', '树洞'],
				swipers: ['../../static/home/lunbo1.jpg', '../../static/home/lunbo2.jpg', '../../static/home/lunbo3.jpg'],
				current: 0,
				tabContentList: '',
				cardList: []
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中...'
			});
			if(!this.$store.state.article){
				this.article()
			}
			
			this.$store.dispatch('getArticle');

		},
		computed: {
			//检查数据是否有，没有一直显示加载中。。。
			showLoading() {
				this.tabContentList.length > 0 ? uni.hideLoading() : 0
				return 1
			}
		},
		methods: {
			onClickItem(e) {
				const currentIndex = e.currentIndex
				if (this.current !== currentIndex) {
					this.current = currentIndex
				};
				//筛选数据
				const target = this.items[currentIndex]
				const data = (currentIndex === 0) ? this.tabContentList : this.tabContentList.filter(item => item.category ===
					target)
				this.cardList = data
			},
			article() {
				this.tabContentList = this.$store.state.article
				this.cardList = this.$store.state.article
				return 1
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
	}
</style>
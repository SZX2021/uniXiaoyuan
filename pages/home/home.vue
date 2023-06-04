<template>
	<view style="display: flex;flex-direction: column;">
		<button type="primary" @click="huoqu">获取数据</button>
		<swiper autoplay circular class="lunbotu">
			<swiper-item v-for="(item,index1) in swipers " :key="index1">
				<image :src="item"></image>
			</swiper-item>
		</swiper>



		<uni-segmented-control :current="current" :values="items" styleType="text" @clickItem="onClickItem" />
		<view class="article">
			<view v-if="current===0" class="article-list">
				<view class="article-list-card" v-for="(item, index2) in article" :key="index2">
					<view class="article-list-card-head">
						<view style="margin-right: 20rpx;">
							<image src="../../static/home/avatar.jpg"
								style="border-radius: 50%;width: 80rpx;height: 80rpx;"></image>
						</view>
						<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
						<view>
							<view style="color: #FC965E; font-weight: bold;margin-bottom: 10rpx;">{{item.authorInfo.userName}}</view>
							<!-- 发布者 -->
							<view style="font-size: 20rpx;color: #999999;"> <uni-dateformat :date="item.time"
									:threshold="[60000,3600000,86400000]"></uni-dateformat> </view> <!-- 发布时间 -->
						</view>
					</view>
					<view @click="toDetail()" class="article-list-card-content">
						{{item.content}} <!-- 发布内容 -->
					</view>
					<view class="article-list-card-data">
						<view class="article-list-card-data-left">
							{{item.view_num}}
							<text>次</text>
						</view><!--例：浏览量 29次 -->
						<view class="article-list-card-data-right">
							<uni-icons type="chat" size='40rpx' @click="toDetail('comment')"></uni-icons>
							<view style="margin-right: 20rpx;font-size: 22rpx;">{{item.comment_num}}</view>
							<uni-icons type="hand-up" size='40rpx' v-if="liked===false" @click="likeClicked('add')" />
							<uni-icons type="hand-up-filled" size='40rpx' v-else @click="likeClicked('sub')" />
							<view style="font-size: 22rpx;">{{item.like_num}}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="current===1">1</view>
			<view v-if="current===2">2</view>
			<view v-if="current===3">3</view>
			<view style="width: 100%;height: 200rpx; padding-top: 22rpx;">
				<text style="font-size: 20rpx; color: #888888;display: flex;justify-content: center;">人家也是有底线的，怎么刷都没有了哦~</text>
			</view>	
		</view>

		<zdy-tabbar :current-page="0"></zdy-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: ['全部', '日常', '集市', '树洞'],
				swipers: ['../../static/home/lunbo1.jpg', '../../static/home/lunbo2.jpg', '../../static/home/lunbo3.jpg'],
				current: 0,

			}
		},
		onLoad() {
			
			// console.log('home66:',this.$store.state.userInfo);
			// uni.setStorageSync('userInfo', {'userName':'haha','userAvatar':'../../static/home/avatar.jpg'});
			
		},
		computed: {
			article(){
				return this.$store.state.article
			}
		},
		methods: {
			huoqu(){
				this.$store.dispatch('getArticle');
			},
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
				};
				console.log('home35：', e.currentIndex)
			},
			toDetail(value) {
				uni.navigateTo({
					url: '../detail/detail'
				});
				// if(value==='comment'){
				// 	弹出键盘
				// }
			},
			likeClicked() {

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

	.article-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
	}

	.article-list-card {
		width: 90%;
		border-radius: 20rpx;
		background-color: white;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		margin-top: 40rpx;
	}

	.article-list-card-head {
		display: flex;
		align-self: flex-start;
		margin-bottom: 40rpx;
	}

	.article-list-card-content {
		width: 100%;
		margin-bottom: 30rpx;
	}

	.article-list-card-data {
		display: flex;
		justify-content: space-between;
		width: 100%;

	}

	.article-list-card-data-left {
		font-size: 22rpx;
		display: flex;
		align-items: center;
	}

	.article-list-card-data-right {
		weight: 100rpx;
		display: flex;
		align-items: center;

	}
</style>
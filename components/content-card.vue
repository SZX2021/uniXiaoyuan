<template>
	<view class="article-list">
		<view class="article-list-card" v-for="(item,index) in contentList" :key="index">
			<view class="article-list-card-head">
				<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
				<view>
					<view class="author_info">
						<image :src="item.author_info.user_avatar"
							style="border-radius: 50%;width: 80rpx;height: 80rpx; margin-right: 10px;"></image>
						<view class="" style="color: #FC965E; font-weight: bold;">
							{{item.author_info.user_name}}
						</view>
						<text class="item-category">{{item.category}}</text>

					</view>
					<!-- 发布者 -->
					<view style="font-size: 20rpx;color: #999999;margin-left: 3px;"> <uni-dateformat :date="item.time"
							:threshold="[60000,3600000,86400000]"></uni-dateformat> </view> <!-- 发布时间 -->
				</view>


			</view>
			<view class="article-list-card-content" @click="toDetail(item._id,false)">

				{{item.content}} <!-- 发布内容 -->

			</view>
			<view class="article-list-card-data">
				<view class="article-list-card-data-left">
					{{item.view_num}}
					<text style="margin-left: 2px;">次</text>
				</view><!--例：浏览量 29次 -->
				<view class="article-list-card-data-right">
					<uni-icons type="chat" size='40rpx' @click="toDetail(item._id,true)"></uni-icons>
					<view style="margin-right: 20rpx;font-size: 22rpx;">{{item.comment_num}}</view>
					<uni-icons type="hand-up" size='40rpx' v-if="!item.liked"
						@click="likeClicked('add',index,item._id)" />
					<uni-icons color="rgb(41, 121, 255)" type="hand-up-filled" size='40rpx' v-else
						@click="likeClicked('sub',index,item._id)" />
					<view style="font-size: 22rpx;">{{item.like_num}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			contentList: {
				type: Array
			}
		},
		computed: {
			avatar() {
				return
			}
		},
		methods: {
			toDetail(value, flag) {
				uni.navigateTo({
					url: `../detail/detail?article_id=${value}&isShowKeyboard=${flag}&message_type=comment`
				});
			},
			likeClicked(api, index, article_id) {

				let liked = api === "add";
				const article_index = index;
				this.$store.commit('tempSetLiked', {
					liked,
					article_index
					// index
				});
				uniCloud.callFunction({
					name: 'updateLike',
					data: {
						liked,
						token: uni.getStorageSync('token'),
						article_id
					}
				})
			}
		},
	}
</script>

<style>
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

	/* 作者信息 */
	.author_info {
		width: 300rpx;
		display: flex;
		align-items: center;
		margin-bottom: 5px;
		padding: 0;

	}

	.item-category {
		margin-left: 10px;
		font-size: 14px;
		color: rgb(193, 193, 193);
	}

	.article-list-card-content {
		width: 100%;
		margin-bottom: 30rpx;
		/* margin-left: 10px; */
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
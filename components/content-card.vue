<template>
	<view class="article-list">
		<view class="article-list-card" v-for="(item,index) in contentList" :key="index">
			<view class="article-list-card-head">
				<view class="article-list-card-head-left">
					<!-- 发布者头像 -->
					<image :src="item.author_info.user_avatar"
						style="border-radius: 50%;width: 80rpx;height: 80rpx; margin-right: 10px;"></image>
					<view>
						<!-- 发布者 -->
						<view class="" style="color: #FC965E; font-weight: bold;">
							{{item.author_info.user_name}}
						</view>
						<!-- 发布时间 -->
						<view style="font-size: 20rpx;color: #999999;"> <uni-dateformat :date="item.time"
								:threshold="[60000,3600000,86400000]"></uni-dateformat> </view> 
					</view>
				</view>
				<view class="article-list-card-head-right">
					<!-- 文章分类 -->
					<text class="item-category">{{item.category}}</text>
				</view>
				
				
			</view>
			
			 <!-- 发布内容 -->
			<view class="article-list-card-content" @click="toDetail(index,false)">
				{{item.content}}
			</view>
			
			<!-- 图片 -->
			<uni-grid :column="3" :showBorder="false" >
				<uni-grid-item v-for="(image,index2) in item.images" :key="index2">
					<image :src="image" style="height: 90%;width: 90%;border-radius: 20rpx;margin: 10rpx;"></image>
				</uni-grid-item>
			</uni-grid>
			<view class="article-list-card-data">
				<!-- 浏览量 -->
				<view class="article-list-card-data-left">
					<!-- <text>浏览量</text>
					{{item.view_num}}
					<text style="margin-left: 2px;">次</text> -->
				</view><!--例：浏览量 29次 -->
				<view class="article-list-card-data-right">
					<uni-icons type="chat" size='40rpx' @click="toDetail(index,true)"></uni-icons>
					<view style="margin-right: 20rpx;font-size: 22rpx;">{{item.comment_num}}</view>
					<uni-icons type="hand-up" size='40rpx' v-if="item.liked===false"
						@click="likeClicked('add',index)" />
					<uni-icons color="rgb(41, 121, 255)" type="hand-up-filled" size='40rpx' v-else
						@click="likeClicked('sub',index)" />
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
			},
			category: {
				type: String
			}
		},
		methods: {
			toDetail(category_index,flag) {
				uni.navigateTo({
					url: `../detail/detail?category=${this.category}&category_index=${category_index}&isShowKeyboard=${flag}&message_type=comment`
				});
			},
			//检查用户是否登录
			checkLogin() {
				// 检查是否注册过
				const token = uni.getStorageSync('token');
				if (!token) {
					uni.showModal({
						title: '提示',
						content: '未登录，请您登录',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								uni.switchTab({
									url: '/pages/my/my'
								});
							} else if (res.cancel) {
								console.log('用户点击取消');
								uni.switchTab({
									url: '/pages/home/home'
								});
							}
						}
					});
					return 0
			
				} else {
					return 1
				}
			},
			likeClicked(api,category_index) {
				if(this.checkLogin()===0){
					return
				};
				let liked = api === "add";
				const article = this.$store.state.article[this.category][category_index]
				this.$store.commit('tempSetLiked', {
					liked,
					article
				});
				uniCloud.callFunction({
					name: 'updateLike',
					data: {
						api:"article",
						liked,
						token: uni.getStorageSync('token'),
						article_id: article._id
					}
				}).catch(e =>{
					console.log(e)
				})
			}
		},
	}
</script>

<style scoped>
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
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}
	.article-list-card-head-left {
		display: flex;
	}

	.item-category {
		margin-left: 10px;
		font-size: 14px;
		color: rgb(193, 193, 193);
	}

	.article-list-card-content {
		 display: -webkit-box;
		-webkit-line-clamp: 2; /* 设置文本行数 */
		-webkit-box-orient: vertical;
		overflow: hidden;
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
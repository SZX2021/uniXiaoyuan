<template>
	<view>
		<view class="container">
			<view class="article-card">
				
				<view class="article-card-head">
					<view class="article-card-head-left">
						<!-- 发布者头像 -->
						<image :src="article.author_info.user_avatar"
							style="border-radius: 50%;width: 80rpx;height: 80rpx; margin-right: 10px;"></image>
						<view>
							<!-- 发布者 -->
							<view class="" style="color: #FC965E; font-weight: bold;">
								{{article.author_info.user_name}}
							</view>
							<!-- 发布时间 -->
							<view style="font-size: 20rpx;color: #999999;"> <uni-dateformat :date="article.time"
									:threshold="[60000,3600000,86400000]"></uni-dateformat> </view> 
						</view>
					</view>
					<view class="article-card-head-right">
						<!-- 文章分类 -->
						<text class="item-category">{{article.category}}</text>
					</view>
				</view>
				
				
				<view class="article-card-content">
					{{article.content}} <!-- 发布内容 -->
				</view>
				<view class="article-card-data">
					<!-- 浏览量 -->
					<view class="article-card-data-left">
						<!-- <text>浏览量</text>
						{{article.view_num}}
						<text>次</text> -->
					</view><!--例：浏览量 29次 -->
					<view class="article-card-data-right">
						<uni-icons type="chat" size='40rpx' @click="() => showKeyboard(true,'comment')"></uni-icons>
						<view style="margin-right: 20rpx;font-size: 22rpx;">{{article.comment_num}}</view>
						<uni-icons type="hand-up" size='40rpx' v-if="article.liked===false"
							@click="articleLikeClicked('add')" />
						<uni-icons color="rgb(41, 121, 255)"  type="hand-up-filled" size='40rpx' v-else
							@click="articleLikeClicked('sub')" />
						<view style="font-size: 22rpx;">{{article.like_num}}</view>
					</view>
				</view>
			</view>

			<view style="align-self: flex-start;padding: 30rpx 30rpx;">
				<text style="font-weight: bold;margin-right: 20rpx;">评论</text>
				<text style="font-weight: bold;">{{article.comment_num}}</text>
			</view>

			<!-- 评论区 -->
			<view class="comment-card" v-for="(item, index1) in article.comment" :key="index1">
				<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
				<view class="comment-card-head">
					<image :src="item.commenter_info.user_avatar" class="comment-card-head-avatar"
						style="border-radius: 50%;width: 60rpx;height: 60rpx;margin-right: 20rpx;"></image>
					<!-- 发布者 -->
					<view class="comment-card-head-publisher" style="align-self: center;font-size: 24rpx;">
						{{item.commenter_info.user_name}}
					</view>
				</view>

				<view class="comment-card-content">
					<view style="width: 80rpx;"></view>
					<text style="font-size: 25rpx;">{{item.content}}</text>
				</view>

				<!-- 评论数据，点赞功能 -->
				<view class="comment-card-data">
					<view style="font-size: 20rpx;color: #999999;display: flex;">
						<view style="width: 80rpx;"></view>
						<uni-dateformat :date="item.time" :threshold="[60000,3600000,86400000]"></uni-dateformat>
					</view>
					<view class="comment-card-data-right">
						<uni-icons type="hand-up" size='40rpx' v-if="item.liked===false"
							@click="commentLikeClicked('add',false,item)" />
						<uni-icons color="rgb(41, 121, 255)" type="hand-up-filled" size='40rpx' v-else
							@click="commentLikeClicked('sub',false,item)" />
						<text style="font-size: 22rpx;margin-right: 20rpx;">{{item.like_num}}</text>
					</view>
				</view>			
			</view>

			<!-- 键盘区 -->
			<!-- 根据变量控制输入框的显示和隐藏 -->
			<view class="input-wrap" v-show="isShowKeyboard">
				<view style="margin: 40rpx;">
					<image :src="avatar()" style="border-radius: 50%;width: 60rpx;height: 60rpx;"></image>
				</view>
				<view style="display: flex;align-items: center; background-color: #F5F7FA;border-radius: 20rpx;">
					<textarea @blur="showKeyboard(false)" v-model="message" :autoHeight="true" placeholder="请输入评论内容"
						:focus='isShowKeyboard' :show-confirm-bar="false" :fixed="true" cursor-spacing='40rpx'
						style="margin: 20rpx;width:450rpx;"></textarea>
					<text @click="sendMessage" style="margin: 20rpx 30rpx;align-self: flex-end;">完成</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				isShowKeyboard: false, //控制输入框显示
				article: {},
				message: '', //评论区输入框内容
				category: '',
				category_index: '',
				message_type: String,
				comment_id: String,
				replyer_to_user: String,
				replyer_to_user_id: String,
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			});
			this.isShowKeyboard = JSON.parse(options.isShowKeyboard);
			this.category = options.category;
			this.category_index = options.category_index;
			this.message_type = options.message_type;
			this.article = this.$store.state.article[this.category][this.category_index];
			if (!("comment" in this.article) ) {
				store.dispatch('getComment',this.article);
				this.$watch('article',this.watchCall,{flush:'post'});
			} else {
				uni.hideLoading();
			}
			
			
		},
		methods: {
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
					return false
			
				} else {
					return true
				}
			},
			showKeyboard(flag, message_type, comment_id, replyer_to_user, replyer_to_user_id) {
				if(!this.checkLogin()){
					return ;
				} else {
					this.isShowKeyboard = flag;
					this.message_type = message_type;
					this.comment_id = comment_id;
					this.replyer_to_user = replyer_to_user;
					this.replyer_to_user_id = replyer_to_user_id;
				}
			},	
			sendMessage() {
				if (!this.message) {
					uni.showToast({
						title: "输入不能为空",
						icon: "error"
					});
					return;
				};
				uni.showLoading({
					title: '发布中...'
				});
				if (this.message_type === "comment") {
					uniCloud.callFunction({
						name: 'uploadComment',
						data: {
							article_id: this.article._id,
							content: this.message,
							token: uni.getStorageSync('token'),
							time: Date.now(),
						}
					}).then((res) => {
						uni.hideLoading();
						console.log("detail204:",res.result);
						if (res.result) {
							uni.showToast({
								title: '内容敏感',
								icon: 'error'
							});
						} else {
							store.dispatch('getComment',this.article);
							this.message = '';
							this.article.comment_num++
						};
					});
				};
			},
			articleLikeClicked(api) {
				if(!this.checkLogin()){
					return ;
				} else {
					const liked = api === "add";
					store.commit('tempSetLiked', {
						liked,
						article:this.article
					});
					uniCloud.callFunction({
						name: 'updateLike',
						data: {
							api: "article",
							liked,
							token: uni.getStorageSync('token'),
							article_id: this.article._id
						}
					});
				}
			},
			commentLikeClicked(api, article, comment) {
				if(!this.checkLogin()){
					return ;
				} else {
					const liked = (api === "add");
					store.commit('tempSetLiked', {
						liked,
						article,
						comment
					});
					uniCloud.callFunction({
						name: 'updateLike',
						data: {
							api: "comment",
							liked,
							token: uni.getStorageSync('token'),
							comment_id: comment._id
						}
					});
				};
			},
			avatar() {
				return uni.getStorageSync('user_info').user_avatar
			},
			watchCall(){
				if("comment" in this.article){
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
	}

	.article-card {
		width: 90%;
		border-radius: 20rpx;
		background-color: white;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		margin-top: 40rpx;
	}

	.article-card-head {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}
	.article-card-head-left {
		display: flex;
	}
	
	.item-category {
		margin-left: 10px;
		font-size: 14px;
		color: rgb(193, 193, 193);
	}

	.article-card-content {
		width: 100%;
		margin-bottom: 30rpx;
	}

	.article-card-data {
		display: flex;
		justify-content: space-between;
		width: 100%;

	}

	.article-card-data-left {
		font-size: 22rpx;
		display: flex;
		align-items: center;
	}

	.article-card-data-right {
		weight: 100rpx;
		display: flex;
		align-items: center;

	}

	.comment-card {
		width: 90%;
		border-radius: 20rpx;
		background-color: white;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		margin-top: 40rpx;
	}
	.comment-card-head {
		display: flex;
	}
	

	.content {
		width: 100%;
	}

	.comment-card-content {
		display: flex;
		justify-self: start;
		width: 100%;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.comment-card-data {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-bottom: 20rpx;
	}

	.comment-card-data-left {
		font-size: 20rpx;
		color: #999999;
		display: flex;
	}

	.comment-card-data-right {
		weight: 100rpx;
		display: flex;
		align-items: center;
	}

	.view-all {
		background-color: #f8f8f8;
		border-radius: 5rpx;
		width: fit-content;
		padding: 10rpx 20rpx;
		margin-left: 80rpx;
	}
	
	.view-all text {
		font-size: 22rpx;
		font-weight: bold;
		color: rgb(41, 121, 255);
	}

	.data {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.data-right {
		weight: 100rpx;
		display: flex;
		align-items: center;
	}

	.input-wrap {
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
	}

	/* 回复版块样式 */
	.reply {
		background-color: #f8f8f8;
		width: 100%;
		border-radius: 5rpx;
		padding: 20rpx 20rpx 10rpx;
	}

	.reply-head {
		display: flex;
		align-items: center;
		font-weight: bold;
	}

	.reply-content {
		display: flex;
		justify-self: start;
		width: 100%;
		margin-left: 80rpx;
		font-weight: bold;
	}
</style>
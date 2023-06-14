<template>
	<view>
		<view class="container">
			<view class="article-card">
				<view class="article-card-head">
					<view style="margin-right: 20rpx;">
						<image :src='article.author_info.user_avatar'
							style="border-radius: 50%;width: 80rpx;height: 80rpx;"></image>
					</view>
					<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
					<view>
						<view style="color: #FC965E; font-weight: bold;margin-bottom: 10rpx;">
							{{article.author_info.user_name}}
						</view>
						<!-- 发布者 -->
						<view style="font-size: 20rpx;color: #999999;"> <uni-dateformat :date="article.time"
								:threshold="[60000,3600000,86400000]"></uni-dateformat> </view> <!-- 发布时间 -->
					</view>
				</view>
				<view class="article-card-content">
					{{article.content}} <!-- 发布内容 -->
				</view>
				<view class="article-card-data">
					<view class="article-card-data-left">
						{{article.view_num}}
						<text>次</text>
					</view><!--例：浏览量 29次 -->
					<view class="article-card-data-right">
						<uni-icons type="chat" size='40rpx' @click="() => showKeyboard(true,'comment')"></uni-icons>
						<view style="margin-right: 20rpx;font-size: 22rpx;">{{article.comment_num}}</view>
						<uni-icons type="hand-up" size='40rpx' v-if="article.liked===false"
							@click="articleLikeClicked('add',article_index,article_id)" />
						<uni-icons type="hand-up-filled" size='40rpx' v-else
							@click="articleLikeClicked('sub',article_index,article_id)" />
						<view style="font-size: 22rpx;">{{article.like_num}}</view>
					</view>
				</view>
			</view>

			<view style="align-self: flex-start;padding: 30rpx 30rpx;">
				<text style="font-weight: bold;margin-right: 20rpx;">评论</text>
				<text style="font-weight: bold;">1</text>
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

				<view class="detail_comment_area_content">
					<view style="width: 80rpx;"></view>
					<text style="font-size: 25rpx;">{{item.content}}</text>
				</view>




				<!-- 评论数据，点赞功能 -->
				<view class="comment-card-data">
					<view style="font-size: 20rpx;color: #999999;display: flex;">
						<view style="width: 80rpx;"></view>
						<uni-dateformat :date="item.time" :threshold="[60000,3600000,86400000]"></uni-dateformat>
					</view>
					<view>
						<uni-icons type="hand-up" size='40rpx' v-if="article.liked===false"
							@click="commentLikeClicked('add',article_index,index1,item._id)" />
						<uni-icons type="hand-up-filled" size='40rpx' v-else
							@click="commentLikeClicked('sub',article_index,index1,item._id)" />
						<text style="font-size: 22rpx;">12</text>
						<uni-icons type="chat" size='40rpx'
							@click="() => showKeyboard(true,'reply',item._id,item.commenter_info.user_name,item.commenter_info._id)" />
					</view>

				</view>

				<!-- 评论回复功能 -->
				<view class="reply inline_card_two" v-for="(reply,index2) in item.comment_reply" :key="index2">
					<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
					<view class="reply_head">
						<image :src="item.commenterInfo.commenterAvatar"
							style="border-radius: 50%;width: 60rpx;height: 60rpx;margin-right: 20rpx;"></image>
						<!-- 发布者 -->
						<view class="comment_publisher" style="align-self: center;font-size: 24rpx;">
							{{reply.replyer_name}}
						</view>
						<uni-icons type="forward" size="20rpx" style="margin: 0 20rpx;" />
						<view style="align-self: center;font-size: 20rpx; ">{{reply.replyer_to_user_name}}</view>
					</view>
					<!-- 发布内容 -->
					<view class="reply_content">
						{{reply.content_reply}}
					</view>

					<view class="comment-card-data">
						<view style="font-size: 20rpx;color: #999999;display: flex;">
							<view style="width: 80rpx;"></view>
							<uni-dateformat :date="item.time" :threshold="[60000,3600000,86400000]"></uni-dateformat>
						</view>
						<view>
							<uni-icons type="hand-up" size='40rpx' v-if="article.liked===false"
								@click="replyLikeClicked('add',article_index,index1,index2,reply._id)" />
							<uni-icons type="hand-up-filled" size='40rpx' v-else
								@click="replyLikeClicked('sub',article_index,index1,index2,reply._id)" />
							<text style="font-size: 22rpx;">{{reply.like_num}}</text>
							<uni-icons type="chat" size='40rpx'
								@click="() => showKeyboard(true,'reply',item._id,reply.commenter_info.user_name,itme.commenter_info._id)"></uni-icons>
						</view>

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
				message: '', //评论区输入框内容
				article_id: '',
				article_index: '',
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
			this.article_id = options.article_id;
			this.message_type = options.message_type;
			this.article_index = this.$store.state.article.findIndex(item => item._id === options.article_id);
			if (!("comment" in this.$store.state.article[this.article_index])) {
				this.$store.dispatch('getComment', {
					index: this.article_index,
					article_id: options.article_id
				});
			};
			uni.hideLoading();
		},
		computed: {
			article() {
				return this.$store.state.article.find(item => item._id === this.article_id);
			}
		},
		methods: {
			showKeyboard(flag, message_type, comment_id, replyer_to_user, replyer_to_user_id) {
				this.isShowKeyboard = flag;
				this.message_type = message_type;
				this.comment_id = comment_id;
				this.replyer_to_user = replyer_to_user;
				this.replyer_to_user_id = replyer_to_user_id;
			},
			sendMessage() {
				if (!this.message) {
					uni.showToast({
						title: "输入不能为空"
					});
					return;
				};
				uni.showLoading({
					title: '敏感内容检测中...'
				});
				if (this.message_type === "comment") {
					uniCloud.callFunction({
						name: 'uploadComment',
						data: {
							article_id: this.article_id,
							content: this.message,
							token: uni.getStorageSync('token'),
							time: Date.now(),
						}
					}).then((res) => {
						uni.hideLoading();
						console.log(res.result);
						if (res.result) {
							uni.showToast({
								title: '内容敏感',
								icon: 'error'
							});
						} else {
							const data = {
								"content": this.message,
								"like_num": 0,
								"reply_num": 0,
								"commenter_info": uni.getStorageSync('user_info'),
								"time": Date.now()
							};
							//在本地临时更新页面数据
							this.$store.commit('tempAddComment', {
								index: this.article_index,
								value: data
							});
							this.message = '';
						};
					});
				};
				if (this.message_type === "reply") {
					uniCloud.callFunction({
						name: 'uploadReply',
						data: {
							article_id: this.article_id,
							content_reply: this.message,
							replyer_name: uni.getStorageSync('user_info').user_name,
							token: uni.getStorageSync('token'),
							time: Date.now(),
							comment_id: this.comment_id,
							replyer_to_user_name: this.replyer_to_user,
							replyer_to_user_id: this.replyer_to_user_id,
						}
					}).then((res) => {
						uni.hideLoading();
						console.log(res.result);
						if (res.result) {
							uni.showToast({
								title: '内容敏感',
								icon: 'error'
							});
						} else {
							const data = {
								"content": this.message,
								"like_num": 0,
								"reply_num": 0,
							};
							//在本地临时更新页面数据
							this.$store.commit('tempAddComment', {
								index: this.article_index,
								value: data
							});
							this.message = '';
						};
					});
				}

			},

			articleLikeClicked(api, article_index, article_id) {
				const liked = api === "add";
				this.$store.commit('tempSetLiked', {
					liked,
					index
				});
				uniCloud.callFunction({
					name: 'updateLike',
					data: {
						api: "article",
						liked,
						token: uni.getStorageSync('token'),
						article_id
					}
				});
			},
			commentLikeClicked(api, article_index, comment_index, comment_id) {
				const liked = (api === "add");
				this.$store.commit('tempSetLiked', {
					liked,
					article_index,
					comment_index
				});
				uniCloud.callFunction({
					name: 'updateLike',
					data: {
						api:"comment",
						liked,
						token: uni.getStorageSync('token'),
						comment_id
					}
				});
			},
			replyLikeClicked(api, article_index, comment_index, reply_index, reply_id) {
				const liked = (api === "add");
				this.$store.commit('tempSetLiked', {
					liked,
					article_index,
					comment_index,
					reply_index
				});
				uniCloud.callFunction({
					name: 'updateLike',
					data: {
						api: "reply",
						liked,
						token: uni.getStorageSync('token'),
						reply_id
					}
				});
			},
			avatar() {
				return uni.getStorageSync('user_info').user_avatar
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
		display: flex;
		align-self: flex-start;
		margin-bottom: 40rpx;
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

	.content {
		width: 100%;
	}

	.detail_comment_area_content {
		display: flex;
		justify-self: start;
		width: 100%;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.comment-card-data {
		display: flex;
		justify-content: flex-end;
		width: 100%;
		margin-bottom: 20rpx;
	}

	.comment-card-data_left {
		font-weight: bold;
		font-size: 22rpx;
	}

	.comment-card-data_right {
		weight: 100rpx;
		display: flex;
		align-items: center;

	}

	.data {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.data_right {
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
	.inline_card_two {
		background-color: #f8f8f8;
		width: 100%;
		border-radius: 5rpx;
		padding: 20rpx 20rpx 10rpx;
	}

	.reply_head {
		display: flex;
		font-weight: bold;
	}

	.reply_content {
		display: flex;
		justify-self: start;
		width: 100%;
		padding-left: 15%;
		font-weight: bold;
	}
</style>
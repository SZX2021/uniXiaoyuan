<template>
	<view>
		<view class="container">
			<view class="article-card">
				<view class="article-card-head">
					<view style="margin-right: 20rpx;">
						<image src='../../static/home/avatar.jpg'
							style="border-radius: 50%;width: 80rpx;height: 80rpx;"></image>
					</view>
					<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
					<view>
						<view style="color: #FC965E; font-weight: bold;margin-bottom: 10rpx;">{{article.author_info.user_name}}</view>
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
						<uni-icons type="chat" size='40rpx' @click="showKeyboard(true)"></uni-icons>
						<view style="margin-right: 20rpx;font-size: 22rpx;">{{article.comment_num}}</view>
						<uni-icons type="hand-up" size='40rpx' v-if="liked===false" @click="likeClicked('add')" />
						<uni-icons type="hand-up-filled" size='40rpx' v-else @click="likeClicked('sub')" />
						<view style="font-size: 22rpx;">{{article.like_num}}</view>
					</view>
				</view>
			</view>
			<view style="align-self: flex-start;padding: 30rpx 30rpx;">
				<text class="margin_right_20;" style="font-weight: bold;">评论</text>
				<text style="font-weight: bold;">1</text>
			</view>
			<view class="comment_card" v-for="(item, index) in article.comment" :key="index">
				<view class="head">
					<image :src="item.commenter_info.commenter_avatar" style="border-radius: 50%;width: 60rpx;height: 60rpx;margin-right: 20rpx;"></image>
					<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
					<view class="comment_publisher" style="align-self: center;font-size: 24rpx;">{{item.commenter_info.commenter_name}}</view> <!-- 发布者 -->
				</view>
				
				<view class="detail_comment_area_content margin_bottom_20">
					<view style="width: 80rpx;"></view>
					<text style="font-size: 25rpx;">{{item.content}}</text>
				</view>	
								
				<view style="font-size: 20rpx;color: #999999;display: flex;">
					<view style="width: 80rpx;"></view>
					<uni-dateformat :date="item.time" :threshold="[60000,3600000,86400000]"></uni-dateformat>
				</view>
				
				
				<!-- 评论数据，点赞和分享功能 -->
				<view class="detail_comment_area_data margin_bottom_20 ">
					<view class="detail_comment_area_data_left ">浏览量 29次</view>
					<view class="detail_comment_data_right" >
						<uni-icons type="chat" size='40rpx'/>
						<text  style="margin-right: 20rpx;font-size: 22rpx;">12</text>
						<uni-icons type="hand-up" size='40rpx'/>
						<text style="font-size: 22rpx;">12</text>
					</view>				
				</view>
				<!-- 评论回复功能 -->
				<view class="reply inline_card_two">
					<view class="reply_head">
						<image :src="item.commenterInfo.commenterAvatar" style="border-radius: 50%;width: 60rpx;height: 60rpx;margin-right: 20rpx;"></image>
						<!-- 头像组件无法修改样式，在组件外加一个view用来调整外边距 -->
						<view class="comment_publisher" style="align-self: center;font-size: 24rpx;">{{item.commenterInfo.commenterName}}</view> <!-- 发布者 -->
						<uni-icons type="forward" size="20rpx" style="margin: 0 20rpx;"/>
						<view style="align-self: center;font-size: 20rpx; "> woshi黑黑</view>
					</view>
					<view class="reply_content margin_bottom_20">
						你好
					</view>	
				</view>
			</view>
			<!-- 根据变量控制输入框的显示和隐藏 -->
			<view class="input-wrap" v-show="isShowKeyboard">
				<view style="margin: 40rpx;">
					<image :src="(userAvatar() ? userAvatar() : '../../static/home/avatar_default.jpg')" style="border-radius: 50%;width: 60rpx;height: 60rpx;"></image>
				</view>
				<view style="display: flex;align-items: center; background-color: #F5F7FA;border-radius: 20rpx;">
					<textarea
						@blur="showKeyboard(false)"
						v-model="message"
						:autoHeight="true" 
						placeholder="请输入评论内容" 
						:focus='isShowKeyboard'
						:show-confirm-bar="false"
						:fixed="true"
						cursor-spacing= '40rpx'
						style="margin: 20rpx;width:450rpx;"
						></textarea>
					<text @click="sendMessage" style="margin: 20rpx 30rpx;align-self: flex-end;">完成</text>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import store  from '@/store/index.js';
	export default {
		data() {
			return {
				isShowKeyboard: false, //控制输入框显示
				message: '' ,//评论区输入框内容
				article_id: '',
				articleIndex: ''
			}
		},
		onLoad(options) {
			this.isShowKeyboard = JSON.parse(options.isShowKeyboard);
			this.article_id = options.article_id;
			this.articleIndex = this.$store.state.article.findIndex(item => item._id===options.article_id);
			console.log(this.articleIndex);
			this.$store.dispatch('getComment',{index:this.articleIndex,article_id:options.article_id});
		},
		onShow() {
			uni.showLoading({
				title: '加载中...'
			});
			uni.hideLoading();
		},  
		computed:{
			article(){
				return this.$store.state.article.find(item => item._id===this.article_id);
			}
		},
		onReachBottom() {
			this.getCommentList();
		},
		methods: {
			showKeyboard(flag){
				this.isShowKeyboard = flag;
			},
			sendMessage(){
				if(!this.message){
					uni.showToast({
						title: "输入不能为空"
					});
					return;
				};
				uni.showLoading({
					title: '敏感内容检测中...'
				});
				uniCloud.callFunction({
					name: 'uploadComment',
					data:{
						articleId: this.Id,
						content: this.message,
						token: uni.getStorageSync('token'),
						time: Date.now(),
					} 
				}).then((res)=>{
					uni.hideLoading();
					console.log(res.result);
					if(res.result){
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
						this.$store.commit('tempAddComment',{jindex:this.index,value:this.data});
						this.message = '';
					};
				});
			},
			likeClicked(value) {
				// 处理点赞逻辑
				if(value==='add'){
					//添加点赞数量
					this.liked = true;
					
					uniCloud.callFunction({
						name: 'refreshArticleData',
						data: {
							api: 'addLikes',
							id: this.Id
						}
					});			
					
					this.likeNumber ++;
					
					//记录点赞用户
					uniCloud.callFunction({
						name: 'refreshLikes',
						data: {
							api: 'add',
							userToken: uni.getStorageSync('token'),
							articleId: this.Id
						}
					})
					
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptData',{
						liked:this.liked,
						likeNumber: this.likeNumber,
						commentNumber: this.commentNumber,
						likeNumber: this.likeNumber
					})	
				};
				if(value==='sub'){
					//减少点赞数量
					this.liked = false;
					
					uniCloud.callFunction({
						name: 'refreshArticleData',
						data: {
							api: 'subLikes',
							id: this.Id
						}
					});
					
					this.likeNumber --;
					
					//删除特定用户点赞的文章记录
					uniCloud.callFunction({
						name: 'refreshLikes',
						data: {
							api: 'sub',
							userToken: uni.getStorageSync('token'),
							articleId: this.Id
						}
					});
					
					const eventChannel = this.getOpenerEventChannel()
					eventChannel.emit('acceptData',{
						liked:this.liked,
						likeNumber: this.likeNumber,
						commentNumber: this.commentNumber,
						likeNumber: this.likeNumber
					})	
				};
			},
			avatar(){
				return store.state.avatar;
			},
			userAvatar(){
				return uni.getStorageSync('userAvatar');
			}
		}
	}
</script>

<style>
	.container{
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
	.comment_card {
		width: 90%;
		border-radius: 20rpx;
		background-color: white;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		margin-top: 40rpx;
	}
	.content{
		width: 100%;
	}
	.detail_comment_area_content{
		display: flex;
		justify-self: start;
		width: 100%;
		font-weight: bold;
	}
	.detail_comment_area_data{
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding-left: 15%;
	}
	.detail_comment_area_data_left {
		font-weight: bold;
		font-size: 22rpx;
	}
	.detail_comment_area_data_right {
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
	.input-wrap{
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #FFFFFF;
		position:fixed; 
		bottom:0; 
	}
	 /* 回复版块样式 */
	.inline_card_two{
		background-color: #f8f8f8;
		width: 100%;
		border-radius: 5rpx;
		padding: 20rpx;
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
	/* 公共部分 */
	.margin_bottom_20{
		margin-bottom: 20rpx;
	}
	.margin_bottom_30{
		margin-bottom: 30rpx;
	}
	.margin_right_20{
		margin-right: 20rpx;
	}
</style>

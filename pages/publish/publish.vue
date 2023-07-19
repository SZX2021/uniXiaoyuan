<template>
	<view class="container">
		<view class="card">
			<!-- 文本 -->
			<textarea class="text" placeholder="请输入投稿内容{禁止引战,不完整信息,广告}" :maxlength="400" v-model="content"></textarea>
			<!-- 输入框右下角，字数限制 -->
			<view style="align-self: flex-end;color: #808080;">{{content.length}}/400</view>
			<!-- 照片 -->
			<uni-file-picker file-mediatype="image" :limit="9" ref="images" :auto-upload="false" @success="success"></uni-file-picker>
			<!-- 分类标签 -->
			<view class="tags">
				<uni-tag class="tag" :circle="true" v-for="(tag,index) in tags" :key="index" :inverted="tag.inverted"
					:text="tag.tag" type="primary" @click="setInverted(index)" />
			</view>
			<view class="line"></view>
			<!-- 是否匿名 -->
			<!-- <view class="niming">
				<text style="font-size: 24rpx;">开启匿名模式</text>

				<switch color="#FCC53A" :checked="nimingFlag" style="transform: scale(0.7);" @change="isNiming" />
			</view> -->
		</view>

		<button class="button" @click="uploadForm">发布投稿</button>
		<zdy-tabbar :current-page="1"></zdy-tabbar>
	</view>
</template>

<script>
	const db = uniCloud.database();
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				tags: [
					{
						inverted: false,
						tag: "日常"
					},
					{
						inverted: true,
						tag: "吐槽"
					},
					{
						inverted: true,
						tag: "集市"
					},{
						inverted: true,
						tag: "失物招领"
					},
				],
				content: '',
				images: [],
				nimingFlag: false,

			}
		},
		methods: {
			onLoad() {
				this.checkLogin()
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
			// 用于选择标签
			setInverted(index) {
				this.tags.forEach(item => item.inverted = true);
				this.tags[index].inverted = !this.tags[index].inverted;
			},

			success(e) {
				this.images = e.tempFilePaths  ;//将上传后的图片地址赋值给this.images
			},

			// 图片上传失败
			fail(e) {
				uni.showToast({
					title: "上传失败",
					icon: "fail"
				})
			},
			// 是否匿名
			isNiming(e) {
				this.nimingFlag = e.detail.value; //赋值给nimingFlag用于添加数据库时使用
				console.log(e.detail.value)
			},
			//检查内容
			checkForm() {
				//正则表达式 不能少于五个汉字
				const regex = /[\u4e00-\u9fff]{5,}/;
				const target = regex.test(this.content)
				if (!target) {
					//提示失败
					uni.showToast({
						title: '内容不能少于5个汉字',
						icon: 'error',
						duration: 2000
					});
					return 0
				}
				return 1
			},
			async uploadForm() {
				//检查是否登录
				const target = this.checkLogin()
				if (!target) {
					return 0
				}
				//检查表单内容是否合法
				if (!this.checkForm()) {
					return 0
				}
				uni.showLoading({
					title: '发布中...'
				});
				await this.$refs.images.upload(); //将选中的图片上传到云储存
				uniCloud.callFunction({
					name: "uploadArticle",
					data: {
						content: this.content,
						images: this.images,
						token: uni.getStorageSync('token'),
						category: this.tags.find(item => item.inverted === false).tag,
						nimingFlag: this.nimingFlag,
						time: Date.now(),
					},
				});
				uni.hideLoading;
				uni.showToast({
					title: '发布成功'
				});
				uni.switchTab({
					url: '../home/home'
				});
				store.commit('resetData');
				uni.reLaunch({
					url: '../home/home'
				})
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.card {
		width: 90%;
		border-radius: 20rpx;
		background-color: white;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		margin-top: 40rpx;
	}

	.text {

		align-self: center;
		font-size: 24rpx;
		width: 100%;
		/* 根据需要调整行间距的数值 */
		line-height: 3px;
		/* 根据需要调整字间距的数值 */
		letter-spacing: 3px;

	}

	.tags {
		display: flex;
		margin-top: 20rpx;
	}

	.tag {
		margin-right: 20rpx;
	}

	.line {
		width: 100%;
		height: 1px;
		background-color: #808080;
		margin: 40rpx 0 20rpx;
	}

	.niming {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.button {
		border-radius: 50rpx;
		width: 90%;
		font-weight: bold;
		color: #fff;
		background-color: #2b85e4;
		margin-top: 40rpx;
	}
</style>
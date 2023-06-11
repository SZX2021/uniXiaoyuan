<template>
	<view class="user-info-container">
		<!-- 头像选择器 -->
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			<image class="avatar" :src="avatarUrl"></image>
		</button>
		<!-- 填写信息 -->
		<form class="info-card" @submit="formSubmit" ref="from">
			<view class="form-item">
				<text class="title">姓名：</text>
				<input name="userName" class="weui-input input" placeholder="请输入昵称" type="nickname" />
			</view>
			<view class="form-item">
				<view class="title">性别： </view>
				<radio-group name="radio" class="radio-group">
					<label class="radio">
						<radio value="男" /><text>男</text>
					</label>
					<label class="radio">
						<radio value="女" /><text>女</text>
					</label>
				</radio-group>
			</view>
			<view class="form-item">
				<text class="title">手机：</text>
				<input name="phoneNumber" class="input" type="tel" placeholder="请输入手机号" />
			</view>
			<view class="form-item">
				<text class="title">签名：</text>
				<textarea name="signature" class="textarea" placeholder="请输入个性签名"></textarea>
			</view>
			<!-- 保存信息 -->
			<button form-type="submit" class="submit">保存信息</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
			}

		},
		methods: {
			//页面加载时
			onLoad() {

			},
			//头像更换
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail

				//图片转换成base64
				uni.getFileSystemManager().readFile({
					filePath: avatarUrl, //选择图片返回的相对路径
					encoding: 'base64', //编码格式
					success: res => { //成功的回调
						console.log(res);
						let base64 = 'data:image/jpeg;base64,' + res.data //不加上这串字符，在页面无法显示的哦
						this.avatarUrl = base64
					},
					fail: (e) => {
						console.log("图片转换失败" + e);
					}
				})

			},
			//处理数据并且调云函数
			async formSubmit(e) {
				//加载
				uni.showLoading({
					title: '加载中'
				});
				//表单数据
				const fromInfo = e.target.value

				// 用户数据
				const userInfo = {
					user_avatar: this.avatarUrl,
					user_name: fromInfo.userName,
					user_gender: fromInfo.radio,
					user_phoneNumber: fromInfo.phoneNumber,
					user_signature: fromInfo.signature
				}
				uni.setStorageSync('user_info', userInfo)

				//检查表单
				const isok = this.rules(userInfo)
				if (!isok.res) {

					uni.showToast({
						title: isok.title,
						icon: 'none',
						duration: 2000
					})
					return 0
				}
				//获取token
				const token = uni.getStorageSync('token');
				//云函数 提交数据
				const res = await uniCloud.callFunction({
					name: 'user-info',
					data: {
						token,
						userInfo
					}
				})
				//返回成功
				if (res.result == 'ok') {
					//消失加载效果
					uni.hideLoading();
					uni.setStorageSync('user_info', userInfo)
					//跳转用户页面
					uni.reLaunch({
						url: '/pages/my/my'
					});

				} else {
					uni.showToast({
						title: '保存失败',
						duration: 2000,
						icon: "error"
					})

				}

			},
			//表单验证
			rules(userInfo) {
				if (!userInfo.user_name.length) {
					return {
						title: '名字不能为空',
						res: 0
					}
				}
				let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!reg.test(userInfo.user_phoneNumber)) {
					return {
						title: '手机号不正确',
						res: 1
					};
				}
				return {
					res: 1
				}

			}

		}

	}
</script>

<style>
	page {
		background-color: rgb(245, 247, 250);

	}

	/* 头像 */
	.avatar-wrapper {
		padding: 0;
		width: 90px;
		height: 90px;
		border-radius: 8px;
		margin-top: 40px;
		margin-bottom: 40px;
		border-radius: 50%;
	}

	.avatar {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	/* 信息表单 */
	.container {
		display: flex;
	}

	.info-card {
		line-height: normal;
		/* padding: 20px; */
		background-color: white;
		border-radius: 20px;
		width: 95%;
		margin: 0 auto;
		/* background-color: w; */
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
		width: 95%;

	}

	.title {
		font-size: 16px;
		color: #333;
		width: 130rpx;
		font-weight: bolder;
		margin-left: 10px;
	}

	.radio-group {
		display: flex;
	}

	.radio {
		margin-right: 20rpx;
		font-size: 28rpx;
	}

	.input {
		flex: 1;
		height: 70rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		border: 1rpx solid #ccc;
		border-radius: 10rpx;
	}

	.textarea {
		flex: 1;
		height: 160rpx;
		padding: 20rpx;
		font-size: 28rpx;
		border: 1rpx solid #ccc;
		border-radius: 10rpx;
		resize: none;
	}

	.submit {
		width: 95%;
		margin: 0 auto;
		height: 50px;
		background-color: 20px;
		background-color: rgb(252, 197, 58);
		font-size: 14px;
		text-align: center;
		line-height: 50px;
		margin-top: 60px;
	}
</style>
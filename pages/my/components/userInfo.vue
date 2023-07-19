<template>
	<view class="user-info-container">
		<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			<image class="avatar" :src="avatarUrl"></image>
		</button>
		<form class="info-card" @submit="formSubmit" ref="form">
			<view class="form-item">
				<text class="title">姓名：</text>
				<input name="userName" class="weui-input input" placeholder="请输入昵称" type="text"
					v-model="userInfo.user_name" required />
				<span class="error" v-if="!userNameValid">请输入有效的姓名</span>
			</view>
			<view class="form-item">
				<text class="title">性别： </text>
				<radio-group name="radio" class="radio-group" @change="radioChange">
					<label class="radio">
						<radio value="男" :checked="userInfo.user_gender==='男'? true:false"/><text>男</text>
					</label>
					<label class="radio">
						<radio value="女" :checked="userInfo.user_gender==='女'? true:false"/><text>女</text>
					</label>
				</radio-group>
			</view>
			<view class="form-item">
				<text class="title">手机：</text>
				<input name="phoneNumber" class="input" type="tel" placeholder="请输入手机号"
					v-model="userInfo.user_phoneNumber" required pattern="\d{11}" />
				<span class="error" v-if="!phoneNumberValid">请输入有效的手机号</span>
			</view>
			<view class="form-item">
				<text class="title">签名：</text>
				<textarea name="signature" class="textarea" placeholder="请输入个性签名"
					v-model="userInfo.user_signature"></textarea>
			</view>
			<button form-type="submit" class="submit">保存信息</button>
		</form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				userInfo: {
					user_name: '',
					user_gender: '男',
					user_phoneNumber: '',
					user_signature: ''
				},
				userNameValid: true,
				phoneNumberValid: true
			};
		},
		onShow() {
			this.userInfo = uni.getStorageSync('user_info')
		},
		methods: {
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail;

				uni.getFileSystemManager().readFile({
					filePath: avatarUrl,
					encoding: 'base64',
					success: (res) => {
						let base64 = 'data:image/jpeg;base64,' + res.data;
						this.avatarUrl = base64;
					},
					fail: (e) => {
						console.log("图片转换失败" + e);
					}
				});
			},
			radioChange(e){
				this.userInfo.user_gender = e.detail.value
			}
			,
			async formSubmit() {
				uni.showLoading({
					title: '加载中'
				});
				const formInfo = this.userInfo;

				uni.setStorageSync('user_info', formInfo);

				const validation = this.validateForm(formInfo);
				if (!validation.valid) {
					uni.showToast({
						title: validation.errorMessage,
						icon: 'none',
						duration: 2000
					});
					return;
				}

				const token = uni.getStorageSync('token');
				const res = await uniCloud.callFunction({
					name: 'user-info',
					data: {
						token,
						userInfo: formInfo
					}
				});
				console.log(res);
				if (res.result === 'ok') {
					uni.hideLoading();
					uni.setStorageSync('user_info', formInfo);
					uni.reLaunch({
						url: '/pages/my/my'
					});
				} else {
					uni.showToast({
						title: '保存失败',
						duration: 2000,
						icon: 'error'
					});
				}
			},
			validateForm(userInfo) {
				if (!userInfo.user_name.length) {
					return {
						valid: false,
						errorMessage: '名字不能为空'
					};
				}
				let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
				if (!reg.test(userInfo.user_phoneNumber)) {
					return {
						valid: false,
						errorMessage: '手机号不正确'
					};
				}
				return {
					valid: true
				};
			}
		}
	};
</script>

<style>
	.error {
		color: red;
		font-size: 12px;
	}

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
		/* background-color: rgb(252, 197, 58); */
		background-color: #2b85e4;
		font-size: 14px;
		text-align: center;
		line-height: 50px;
		margin-top: 60px;
		color: white;
	}
</style>
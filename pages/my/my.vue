<template>
	<view>
		<view class="my-container">
			<!-- 用户信息展示 -->
			<view class="my-info">
				<!-- 头像与名称 -->
				<image :src="userInfo.avatarUrl" mode="" class="left image"></image>
				<text class="my-info-name">{{userInfo.nickName}}</text>
				<!-- 登录与注册按钮 -->
				<button lang="zh_CN" @tap="login" size="default" v-if="!token">登录</button>
				<i class="iconfont  right icon-youjiantou" v-else @tap="jumpUserInfo"></i>
			</view>
			<!-- 链接列表 -->
			<view class="my-link-list">
				<listCard :list="list" />
			</view>
		</view>
		<!-- 自定导航 -->
		<zdy-tabbar :current-page="2"></zdy-tabbar>
	</view>
</template>

<script>
	// 引入icont
	import icont from "./icont.css"
	// import listCard from "./components/listCard.vue"
	export default {
		data() {
			return {
				list: [{
					left: 'icon-guanyuwomen',
					text: '关于我们',
					right: 'icon-youjiantou2',
					url: '/pages/my/components/About'
				}, ],
				userInfo: {
					nickName: '未设置名称',
					avatarUrl: '../../static/touxiang.png'
				},
				token: "",
				userInfoUrl: '/pages/my/components/userInfo'
			}
		},
		onShow() {
			// 检查是否注册过
			const token = uni.getStorageSync('token');
			if (token) {
				const userInfo = uni.getStorageSync('user_info');
				this.token = token;
				this.userInfo.avatarUrl = userInfo.user_avatar;
				this.userInfo.nickName = userInfo.user_name;
			}
		
		},
		methods: {
			// 注册
			async login() {
				try {
					//加载
					uni.showLoading({
						title: '加载中'
					});
					//获取code
					const codeRes = await uni.login({
						provider: 'weixin',
					});
					console.log(codeRes);
					const code = codeRes.code;
					//云函数 提交数据
					const dataRes = await uniCloud.callFunction({
						name: 'user-register',
						data: {
							code,
							avatarUrl: "https://mp-a797baca-203d-4891-8ea0-0831ebc75329.cdn.bspapp.com/default/touxiang.png", //touxiang.png上传后的地址
							nickName: "ybuer" + Date.now()
						}
					});
					//返回的用户数据
					const userdata = dataRes.result;
					//消失加载效果
					uni.hideLoading();
					//本地存储
					uni.setStorageSync('user_info', userdata.user);
					uni.setStorageSync('token', userdata.token);
					// data里面存
					this.token = userdata.token;
					this.userInfo.avatarUrl = userdata.user.user_avatar;
					this.userInfo.nickName = userdata.user.user_name;
					// 页面重载
					uni.redirectTo({
						url: 'my'
					});

				} catch (e) {

					//消失加载效果
					uni.hideLoading();
					//提示失败
					uni.showToast({
						title: '登录失败',
						icon: 'error',
						duration: 2000
					});
				}

			},
			//跳转用户信息编辑页面
			jumpUserInfo() {
				wx.navigateTo({
					url: this.userInfoUrl
				})

			},



		},


	}
</script>

<style>
	page {
		background-color: rgb(245, 247, 250);
	}

	.my-container {
		display: flex;
		flex-direction: column;
	}

	/* 用户信息展示样式 */
	.my-info {
		/* background-color: rgb(252, 197, 58); */

		background-color: #2b85e4;
		width: 100%;
		height: 200px;
		display: flex;
		align-items: center;
		padding: 10px;
		position: relative;
		color: white;
	}

	.left {
		font-size: 80px;
	}

	.image {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}

	.my-info-name {
		margin-left: 20px;
		font-size: 20px;
		font-weight: bold;
	}

	.right {
		font-size: 20px;
		right: 20px;
		position: absolute;

	}

	.icon-zhuce {
		font-size: 70px;

	}

	/* 链接列表样式 */
	.my-link-list {
		width: 90%;
		margin: 10px;
	}
</style>
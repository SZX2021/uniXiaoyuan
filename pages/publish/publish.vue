<template>
	<view class="container">
		<view class="card">
			<!-- 文本 -->
			<textarea class="text" placeholder="请输入投稿内容{禁止引战,不完整信息,广告}" :maxlength="400" v-model="content"></textarea>
			<!-- 输入框右下角，字数限制 -->
			<view style="align-self: flex-end;color: #808080;">{{content.length}}/400</view>
			<!-- 照片 -->
			<uni-file-picker file-mediatype="image" :limit="9" @select="select" @fail="fail"></uni-file-picker>
			<!-- 分类标签 -->
			<view class="tags">
				<uni-tag class="tag" :circle="true" v-for="(tag,index) in tags" :key="index" :inverted="tag.inverted"
					:text="tag.tag" type="primary" @click="setInverted(index)" />
			</view>
			<view class="line"></view>
			<!-- 是否匿名 -->
			<view class="niming">
				<text style="font-size: 24rpx;">开启匿名模式</text>

				<switch color="#FCC53A" style="transform: scale(0.7);" @change="isNiming"/>
			</view>
		</view>

		<button class="button" @click="uploadForm">发布投稿</button>
		<zdy-tabbar :current-page="1"></zdy-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tags: [{
						inverted: false,
						tag: "日常"
					},
					{
						inverted: true,
						tag: "集市"
					},
					{
						inverted: true,
						tag: "树洞"
					},
				],
				content: '',
				files: [],
				nimingFlag: false,
			}
		},
		methods: {
			setInverted(index) {
				this.tags.forEach(item => item.inverted = true);
				this.tags[index].inverted = !this.tags[index].inverted;
				console.log("输出内容：", index)
			},

			// 获取上传状态
			select(e) {
				console.log('选择文件：', e);
				e.tempFilePaths.forEach(item=>this.files.push(item));
				console.log('files:',this.files)
			},

			// 上传失败
			fail(e) {
				uni.showToast({
					title: "上传失败",
					icon: "fail"
				})
			},
			
			isNiming(e){
				this.nimingFlag = e.detail.value;
			},
			
			uploadForm(){
				// <-- 测试代码
				let upData =  {
						// authorInfo: uni.getStorageSync(userInfo),
						content: this.content,
						files: this.files,
						category: this.tags.find(item => item.inverted === false).tag,
						nimingFlag: this.nimingFlag
					}
				console.log(upData);
				// 测试代码 -->
				// uniCloud.callFunction({
				// 	name: 'uploadArticle',
				// 	data: {
				// 		authorInfo: uni.getStorageSync(userInfo),
				// 		content: this.content,
				// 		files: this.files,
				// 		category: this.tags.find(item => item.inverted === false).tag,
				// 		nimingFlag: this.nimingFlag
				// 	}
				// })
				
				uni.switchTab({
					url: '../home/home'
				});
				uni.showToast({
					title: '发布成功'
				});
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
		background-color: #FCC53A;
		margin-top: 40rpx;
	}
</style>
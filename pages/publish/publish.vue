<template>
	<view class="container">
		<view class="card">
			<!-- 文本 -->
			<textarea class="text" placeholder="请输入投稿内容{禁止引战,不完整信息,广告}" :maxlength="400" v-model="content"></textarea>
			<!-- 输入框右下角，字数限制 -->
			<view style="align-self: flex-end;color: #f8f8f8;">{{content.length}}/400</view>
			<!-- 照片 -->
			<uni-file-picker file-mediatype="image" :limit="9"></uni-file-picker>
			<!-- 分类标签 -->
			<view class="tags">
				<uni-tag class="tag" :circle="true" v-for="(tag,index) in tags" :key="index" :inverted="tag.inverted"
					:text="tag.tag" type="primary" @click="setInverted(index)" />
			</view>
			<view class="line"></view>
			<!-- 是否匿名 -->
			<view class="niming">
				<text style="font-size: 24rpx;">开启匿名模式</text>

				<switch color="#FCC53A" style="transform: scale(0.7);" />
			</view>
		</view>

		<button class="button">发布投稿</button>
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
			}
		},
		methods: {
			setInverted(index) {
				this.tags.forEach(item => item.inverted = true);
				this.tags[index].inverted = !this.tags[index].inverted;
				console.log("输出内容：", index)
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
		background-color: #f8f8f8;
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
	}
</style>
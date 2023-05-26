<template>
  <view>
		<view class="card">
			<textarea class="text" :maxlength="400">dddddd</textarea>
			<uni-file-picker file-mediatype="image" :limit="9"></uni-file-picker>
			<view class="tags" v-for="(tag,index) in tags" :key="index">
				<uni-tag :circle="true" :inverted="tag.inverted" :text="tag.tag" type="primary" @click="setInverted(index)" />
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
		  tags: [
			  {inverted:false,tag:"日常"},
			  {inverted:false,tag:"集市"},
			  {inverted:false,tag:"树洞"},
			]
      }
    },
    methods: {
		setInverted(index) {
			this.tags[index].inverted = !this.tags[index].inverted;
			console.log(index)
		}
    }
  }
</script>

<style>
	.card {
		width: 90%;
		border-radius: 20rpx;
		background-color: #f8f8f8;
	}
	.button {
		border-radius: 50rpx;
		width: 90%;
		font-weight: bold;
		background-color: #FCC53A;
	}
</style>

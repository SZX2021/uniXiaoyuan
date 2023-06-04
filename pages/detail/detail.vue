<template>
	<view >
		<view class="content">
			<input type="text" class="input" v-model="content" placeholder="和小伙伴打个招呼~~~~">
			<button type="primary" @click="publish()" size="mini">发布</button>
			
			
		</view>
		<view class="pinglun-box" v-for="item in list" :key="item._id">
			<view class="user-box">
				<view class="user-name font_size24">
					****
				</view>
				<view class="user-publishTime font_size24">
					*****
				</view>
			</view>
			<view  class="">
				{{item.content}}
			</view>
			<view class="pinglun-bottom">
				<view class="">
					点赞
				</view>
				<view class="close"  @click="modalinput()">
					评论
				</view>
				<modal :hidden="hiddenmodalput" cancel-text="取消" confirm-text="提交" bindcancel="cancel" bindconfirm="confirm">
					<input type="text" v-model="text" placeholder="请输入"/>
				</modal>
			</view>
		</view>
	</view>
</template>

<script>
import { TriggerOpTypes } from "vue";
	export default {
		data() {
			return {
				content: '',
				list: [],
				hiddenmodalput: true,
			}
		},
		onLoad() {
			uniCloud.callFunction({
				name:'fun',
				data: {
					api: 'getMessages',
				},
			}).then(res =>{
				this.list = res.result.data
			});
			
		},
		
		methods: {
			publish(){
				uniCloud.callFunction({
					name:'fun',
					data: {
						api:'publish',
						content: this.content,
						publishTime: new Date().toLocaleDateString(),
					}
				}).then(res =>{
					console.log(res)
				})
			},
			
			modalinput : function(){
				this.hiddenmodalput = false
				console.log("modalinput")
			},
			cancel(){
				this.hiddenmodalput = true
				console.log("cancel")
			},
			confirm(){
			  this.hiddenmodalput= true
			  console.log("confirm")
			},
		},
		  
	}
</script>

<style>
	.pinglun-bottom{
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	.pinglun-box{
		background-color: silver;
		margin: 20rpx;
		padding: 6rpx;
		border-radius: 20rpx;
	}
	.input{
		border-bottom: 1rpx solid #ccc;
		padding: 6rpx;
		flex: 1;
	}
	
	.content{
		display: flex;
		align-items: content;
		justify-content: center;
		margin: 20rpx;
		background-color: antiquewhite;
		border-radius: 10rpx;
	}
	
	.font_size24{
		font-size: 24rpx;
	}
	.toast-box {
	  width: 100%;
	  height: 100%;
	  opacity: 1;
	  position: fixed;
	  top: 0px;
	  left: 0px;
	}
	.toastbg {
	  opacity: 0.5;
	  background-color: black;
	  position: absolute;
	  width: 100%;
	  min-height: 100vh;
	}
	
	.showToast {
	  position: absolute;
	  opacity: 1;
	  width: 80%;
	  margin-left: 10%;
	  margin-top: 70%;
	}
	.toast-main {
	  padding-top: 2vh;
	  padding-bottom: 2vh;
	  background-color: white;
	  text-align: center;
	  border-top-left-radius: 16rpx;
	  border-top-right-radius: 16rpx;
	}
	
	.toast-input {
	  margin-left: 5%;
	  margin-right: 5%;
	  margin-top:10%;
	  margin-bottom:10%;
	  background-color: rgb(240, 240, 240);
	  padding-left: 2vh;
	  padding-right: 2vh;
	  padding-top: 1vh;
	  padding-bottom: 1vh;
	}
	.toast-input input{
	  background-color: rgb(240, 240, 240);
	}
	.toast-button {
	  display: flex;
	  background-color: white;
	  height:50px;
	  width:100%;
	  border-radius: 0px;
	  border-bottom-left-radius: 16rpx;
	  border-bottom-right-radius: 16rpx;
	  border-top:1px solid rgb(211, 211, 211);
	}
	
	.button1 {
	  width: 50%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  border-radius: 0px;
	  border-bottom-left-radius: 16rpx;
	}
	
	.button2 {
	  width: 50%;
	  border-left:1px solid rgb(211, 211, 211);
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  color:#40A4D6;
	}
</style>

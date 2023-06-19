import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state() {
		return {
			//公共的变量，这里的变量不能随便修改，只能通过触发mutations的方法才能改变
			userInfo: Object,
			article: [],
			swiper: [],
			skipcount: 0,
		}

	},
	mutations: {
		addArticle(state, value) {
			if (state.article.length === 0) {
				state.article.push(...value);
			} else {
				//比较两个数组的差异 并且把差异添加数组中
				let target = state.article
				const data = value

				data.forEach(item1 => {
					let isDifferent = true;

					target.forEach(item2 => {
						if (item1._id === item2._id) {
							isDifferent = false;
						}
					})

					if (isDifferent) {
						target.unshift(item1)
					}

				})
			};
			state.skipcount += 10;
			
		},
		addComment(state, {index,value}) {
			Vue.set(state.article[index], "comment", value);
		},
		// addReply(state,{article_index,comment_id,value}) {
		// 	const comment = state.article[article_index].comment.find(item => item._id===comment_id);
		// 	console.log(comment);
		// 	// comment.reply = value;
		// 	Vue.set(comment,"reply",value);
		// },
		tempSetLiked(state, {
			liked,
			article_id,
			comment_id,
			reply_id
		}) {
			//通过id定位点赞的内容
			if (reply_id) {
				const article = state.article.find(item => article_id === item._id);
				const comment = article.comment.find(item => comment_id === item._id);
				const reply = comment.reply.find(item => reply_id === item._id);
				reply.liked = liked;
				if (liked) {
					reply.like_num++;
				} else {
					reply.like_num--;
				}
			} else if (comment_id) {
				const article = state.article.find(item => item._id === article_id);
				const comment = article.comment.find(item =>item._id === comment_id);
				comment.liked = liked;
				if (liked) {
					comment.like_num++;
				} else {
					comment.like_num--;
				}
			} else {
				const article = state.article.find(item => article_id === item._id);
				article.liked = liked;
				if (liked) {
					article.like_num++;
				} else {
					article.like_num--;
				}

			}

		},
		// setIsViewAll(state, {article_index,comment_index}){
		// 	Vue.set(state.article[article_index].comment[comment_index],'isViewAll',true)
		// }
		addSwiper(state, value){
			state.swiper = value;
		}
	},
	actions: {
		//相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变
		getArticle(context) {
			uniCloud.callFunction({
				name: 'getArticle',
				data: {
					token: uni.getStorageSync('token'),
				}
			}).then(value => context.commit('addArticle', value.result));
			// 
		},
		//根据文章id获取评论数据
		getComment(context, {index,article_id}) {
			uniCloud.callFunction({
				name: 'getComment',
				data: {
					article_id,
					token: uni.getStorageSync('token'),
				}
			}).then(result => {
				context.commit('addComment', {
					index,
					value: result.result
				})
			});
		},
		getSwiper(store){
			uniCloud.databaseForJQL().collection('swiper').get().then((res)=>{
				store.commit('addSwiper',res.data)
			})
		}
		// async getReply(context, {article_index,comment_id}){
		// 	console.log("store120:",{article_index,comment_id});
		// 	uniCloud.callFunction({
		// 		name: 'getReply',
		// 		data: {
		// 			comment_id,
		// 			token: uni.getStorageSync('token'),
		// 		}
		// 	}).then(result => {
		// 		context.commit('addReply', {
		// 			article_index,
		// 			comment_id,
		// 			value: result.result
		// 		})
		// 	});
		// },
	}
})
export default store
import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state() {
		return {
			//公共的变量，这里的变量不能随便修改，只能通过触发mutations的方法才能改变
			userInfo: Object,
			article: [],
			skipcount: 0,
			limitcount: 10
		}

	},
	mutations: {
		addArticle(state, value) {
			state.article.push(...value);
		},
		addComment(state, {
			index,
			value
		}) {
			Vue.set(state.article[index], "comment", value);
		},
		//提交评论后，在本地生成评论数据
		tempAddComment(state, {
			index,
			value
		}) {
			const newList =[value].push(state.article[index].comment);
			Vue.set(state.article[index],"comment", newList);
		},
		tempAddArticle(state, {value}) {
			const newList = [value].push(state.article);
			state.article = newList;
		},
		tempSetLiked(state, {
			liked,
			article_index,
			comment_index,
			reply_index
		}) {
			if (reply_index) {
				state.article[article_index].comment[comment_index].reply[reply_index].liked = liked;
				if(liked){
					state.article[article_index].comment[comment_index].reply[reply_index].like_num++;
				} else {
					tate.article[article_index].comment[comment_index].reply[reply_index].like_num--;
				}
			} else if (comment_index) {
				state.article[article_index].comment[comment_index].liked = liked;
				if(liked){
					state.article[article_index].comment[comment_index].like_num++;
				} else {
					tate.article[article_index].comment[comment_index].like_num--;
				}
			} else {
				state.article[article_index].liked = liked;
				if (liked) {
					state.article[article_index].like_num++;
				} else {
					state.article[article_index].like_num--;
				}

			}

		}
	},
	actions: {
		//相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变
		getArticle(context) {
			uniCloud.callFunction({
				name: 'getArticle',
				data: {
					token: uni.getStorageSync('token')
				}
			}).then(value => context.commit('addArticle', value.result));
			// 
		},
		//根据文章id获取评论数据
		async getComment(context, {
			index,
			article_id
		}) {
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
	}
})
export default store
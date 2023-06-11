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
		//相当于同步的操作
		addArticle(state,value){
			state.article.push(...value);
		},
		addComment(state,{index,value}){
			Vue.set(state.article[index],"comment",value);
		},
		tempAddComment(state,{index,value}){
			// state.article[index].comment.push(value);
			Vue.set(state.article[index].comment,0,value);
		},
		tempAddArticle(state,{value}){
			state.article.unshift(value);
			// Vue.set(state.article,unshift,value);
		}
	},
    actions: {
		//相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变
		getArticle(context){
			uniCloud.callFunction({
				name: 'getArticle',
				data: {
					skipcount: context.state.skipcount,
					limitcount: context.state.limitcount
				}
			}).then(value =>context.commit('addArticle',value.result));
			 // 
		},
		//根据文章id获取评论数据
		getComment(context,{index,article_id}){
			uniCloud.callFunction({
				name: 'getComment',
				data: {
					article_id
				}
			}).then(result => context.commit('addComment',{index,value:result.result}) ); //value =>console.log(value)
		}
	}
})
export default store


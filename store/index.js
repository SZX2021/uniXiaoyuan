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
		}
	},
    actions: {
		//相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变
		getArticle(context){
			uniCloud.callFunction({
				name: 'getArticleData',
				data: {
					skipcount: context.state.skipcount,
					limitcount: context.state.limitcount
				}
			}).then(value => context.commit('addArticle',value.result.data) )
		}
	}
})
export default store


import Vue from 'vue'

import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state() {
		return {
			//公共的变量，这里的变量不能随便修改，只能通过触发mutations的方法才能改变
			userInfo: Object,
			swiper: [],
			article: {
				'全部': [],
				'日常': [],
				'吐槽': [],
				'集市': [],
				'失物招领': [],
			}, //键值对为分类列表，如："全部"：[文章数据]
			page: {'全部':0,'日常':0,'吐槽':0,'集市':0,'失物招领':0}, //不同分类的分页情况
			total_num: {'全部':0,'日常':0,'吐槽':0,'集市':0,'失物招领':0},
			limitcount: 10
		}

	},
	mutations: {
		addArticle(state,{category,articles}) {
			state.article[category].push(...articles);
			state.page[category]++;
		},
		addComment(state,{article,value}) {
			console.log("32:",article);
			Vue.set(article,"comment",value)
			console.log("34:",article);
		},
		// addReply(state,{article_index,comment_id,value}) {
		// 	const comment = state.article[article_index].comment.find(item => item._id===comment_id);
		// 	console.log(comment);
		// 	// comment.reply = value;
		// 	Vue.set(comment,"reply",value);
		// },
		tempSetLiked(state, {
			liked,
			article,
			comment
		}) {
			console.log(article,liked);
			if(article){
				article.liked = liked;
				if(liked){
					Vue.set(article,'like_num',article.like_num+1)
				} else {
					Vue.set(article,'like_num',article.like_num-1)
				}
			} else {
				Vue.set(comment,'liked',liked)
				if(liked){
					Vue.set(comment,'like_num',comment.like_num+1)
				} else {
					Vue.set(comment,'like_num',comment.like_num-1)
				}
			}
			

		},
		// setIsViewAll(state, {article_index,comment_index}){
		// 	Vue.set(state.article[article_index].comment[comment_index],'isViewAll',true)
		// }
		addSwiper(state, value){
			state.swiper = value;
		},
		setArticleTotalNum(state,value){
			state.total_num["全部"] = value[0]; 
			state.total_num["日常"] = value[1]; 
			state.total_num["吐槽"] = value[2]; 
			state.total_num["集市"] = value[3] ;
			state.total_num["失物招领"] = value[4];
		}
	},
	actions: {
		//相当于异步的操作,不能直接改变state的值，只能通过触发mutations的方法才能改变
		getArticle({state,commit},category="全部") {
			const skipcount = state.page[category] * state.limitcount;
			if(skipcount<state.total_num[category] || skipcount===0){
				uniCloud.callFunction({
				name: 'getArticle',
				data: {
					category,
					skipcount,
					limitcount: state.limitcount,
					token: uni.getStorageSync('token'),
				}
			}).then(value => commit('addArticle', {category,articles: value.result}));
			} else {
				return ;
			}
			
		},
		//根据文章id获取评论数据
		getComment(context, article) {
			uniCloud.callFunction({
				name: 'getComment',
				data: {
					article_id: article._id,
					token: uni.getStorageSync('token'),
				}
			}).then(result => {
				context.commit('addComment', {article,value:result.result})
			});
		},
		getSwiper(store){
			uniCloud.databaseForJQL().collection('swiper').get().then((res)=>{
				const newRes = [];
				res.data.forEach(item => newRes.push(item.image));
				store.commit('addSwiper',newRes)
			})
		},
		async fetchArticleTotalNum({commit}){
			const all_total_num = await uniCloud.databaseForJQL().collection('article').where({}).count();
			const daily_total_num = await uniCloud.databaseForJQL().collection('article').where({'category':"日常"}).count();
			const rant_total_num = await uniCloud.databaseForJQL().collection('article').where({'category':"吐槽"}).count();
			const bazaar_total_num = await uniCloud.databaseForJQL().collection('article').where({'category':"集市"}).count();
			const lostFound_total_num = await uniCloud.databaseForJQL().collection('article').where({'category':"失物招领"}).count();
			commit('setArticleTotalNum',[all_total_num.total,daily_total_num.total,rant_total_num.total,bazaar_total_num.total,lostFound_total_num.total]);
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
	},
	getters: {
		allArticles(state){
			return state.article['全部']
		},
		dailyArticles(state){
			return state.article['日常']
		},
		rantArticles(state){
			return state.article['吐槽']
		},
		bazaarArticles(state){
			return state.article['集市']
		},
		lostFoundArticles(state){
			return state.article['失物招领']
		},
		
	}
})
export default store
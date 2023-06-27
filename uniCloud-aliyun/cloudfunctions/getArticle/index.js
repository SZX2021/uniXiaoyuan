'use strict';
const jwt = require('jsonwebtoken');
exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	});
	
	let resultTemp = [];
	//根据分类，获取数据
	if(event.category==="全部"){
		resultTemp = await dbJQL.collection('article','user').orderBy('_id desc').skip(event.skipcount).limit(event.limitcount).get();
	} else {
		const articleTemp = await dbJQL.collection('article').where({'category':event.category}).skip(event.skipcount).limit(event.limitcount).getTemp();
		resultTemp = await dbJQL.collection(articleTemp,'user').orderBy('_id desc').get();
	};
	
	//根据是否传入token，对数据结构进行处理
	if(event.token){
		const openid = jwt.verify(event.token,"secret").openid;		
		const resultList = resultTemp.data.map((item) => {
			item.liked = (item.like_user_id.indexOf(openid)!==-1);
			// 将原始元素中author_id字段内容，提取到一级字段中作为author_info字段
			const {_id,user_name,user_avatar} = item.author_id[0];
			const author_info = {user_name,user_avatar};
			const { author_id:author_id0,like_user_id, ...key} = item;
			return { author_info, ...key };
		});
		return resultList
	} else {
		const resultList = resultTemp.data.map((item) => {
			item.liked = false;

			// 将原始元素中author_id字段内容，提取到一级字段中作为author_info字段
			const {_id,user_name,user_avatar} = item.author_id[0];
			const author_info = {user_name,user_avatar};
			const { author_id:author_id0,like_user_id, ...key} = item;
			return { author_info, ...key };
		});
		return resultList
	}
	
	
};

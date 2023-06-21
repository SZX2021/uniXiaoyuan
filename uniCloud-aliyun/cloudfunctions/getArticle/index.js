'use strict';
const jwt = require('jsonwebtoken');
exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	});
	if(event.token){
		const openid = jwt.verify(event.token,"secret").openid;
		const resultTemp = await uniCloud.databaseForJQL().collection('article','user').orderBy('_id desc').get();
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
		const resultTemp = await uniCloud.databaseForJQL().collection('article','user').orderBy('_id desc').get();
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

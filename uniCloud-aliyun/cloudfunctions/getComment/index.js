'use strict';
const jwt = require('jwt');
exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	});
	if(event.token){
		const openid = jwt.verifyToken(event.token).openid;
		const commentTemp = await dbJQL.collection('comment').where({
			article_id: event.article_id
		}).orderBy('_id desc').getTemp();
		const commentList = await dbJQL.collection(commentTemp, 'user').get();
		const resultList = commentList.data.map((item) => {
			item.liked = (item.like_user_id.indexOf(openid) !== -1);
			// item.isViewAll = false;
			const {_id: id0,...info} = item.commenter_id[0];
			const commenter_info = {...info};
			const {commenter_id,...rest} = item;
			return {commenter_info,...rest }
		})
		//返回数据给客户端
		return resultList
	} else {
		const commentTemp = await dbJQL.collection('comment').where({
			article_id: event.article_id
		}).orderBy('_id desc').getTemp();
		const commentList = await dbJQL.collection(commentTemp, 'user').get();
		const resultList = commentList.data.map((item) => {
			item.liked = false;
			// item.isViewAll = false;
			const {_id: id0,...info} = item.commenter_id[0];
			const commenter_info = {...info};
			const {commenter_id,...rest} = item;
			return {commenter_info,...rest }
		})
		//返回数据给客户端
		return resultList
	}
	
};
'use strict';
const jwt = require('jsonwebtoken');
exports.main = async (event, context) => {
	console.log(event);
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context,
	});
	const openid = jwt.verify(event.token,"secret").openid;
	const replyTemp = await dbJQL.collection('comment_reply').where({comment_id:event.comment_id}).orderBy('_id desc').getTemp();
	const replyList = await dbJQL.collection(replyTemp,'user').get();
	console.log("replyList:",replyList);
	const resultList = replyList.data.map(item => {
		item.liked = (item.like_user_id.indexOf(openid) !== -1);
		const replyer_info = item.replyer_id[0];
		const {replyer_name,like_user_id,replyer_id,...rest} = item;
		return {replyer_info,...rest}
	})
	//返回数据给客户端
	return resultList
};

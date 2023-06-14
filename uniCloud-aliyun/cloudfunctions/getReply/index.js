'use strict';

exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context,
	});
	const replyTemp = dbJQL.collection('comment_reply').where({comment_id:event.comment_id}).orderBy('_id desc').getTemp();
	const replyList = dbJQL.collection(replyTemp,'user').get();
	// const resultList = replyList.data.map(item => {
		
	// })
	//返回数据给客户端
	return event
};

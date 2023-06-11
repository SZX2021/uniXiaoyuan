'use strict';
exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	});
	const commentTemp = await dbJQL.collection('comment').where({article_id:event.article_id}).orderBy('_id desc').getTemp();
	const commentList = await dbJQL.collection(commentTemp,'comment_reply','user').get();
	const resultList = commentList.data.map(item=>{
		const {comment_reply,_value:_id} = item._id;
		const {_id:_id0,...rest} = item;
		return {comment_reply,_id,...rest}
	})
	console.log(resultList);
	//返回数据给客户端
	return resultList
};

'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event);
	const resultList = await db.collection('article').aggregate().sort({
			"_id": -1
		})
		.lookup({
			from: 'comment',
			localField: '_id',
			foreignField: 'article_id',
			as: 'comments'
		})
		.lookup({
			from: 'comment_reply',
			let: {
				commentIds: '$comments._id'
			},
			pipeline: [{
				$match: {
					$expr: {
						$in: ['$comment_id', '$$commentIds']
					}
				}
			}],
			as: 'comments.replies'
		})
		.end();

	// const comment_reply_Temp = db.collection('article','user');
	//返回数据给客户端
	return resultList
};
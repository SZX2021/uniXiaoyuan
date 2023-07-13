'use strict';
const jwt = require('jwt'); 
const UniSecCheck = require('uni-sec-check');
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	});
	const openid = jwt.verifyToken(event.token).openid;
	const uniSecCheck = new UniSecCheck({
		provider: "mp-weixin",
		requestId: context.requestId,
	});
	const checkRes = await uniSecCheck.textSecCheck({
		content: event.content_reply, // 文本内容，不可超过500KB
		openid, // 用户的小程序openid
		scene: 2, // 场景值
		version: 2, // 接口版本号
	});
	
	if(checkRes.result.suggest!="pass"){
		return false
	} else{
		
		dbJQL.collection('comment_reply').add({
			"replyer_id": openid,
			"replyer_name": event.replyer_name,
			"content_reply": event.content_reply,
			"like_num": 0,
			"time": event.time,
			"comment_id": event.comment_id,
			"replyer_to_user_name": event.replyer_to_user_name,
			"replyer_to_user_id": event.replyer_to_user_id,
			"like_user_id": []
		});
		db.collection('article').doc(event.article_id).update({
				comment_num: dbCmd.inc(1)
		});
		db.collection('comment').doc(event.comment_id).update({
				reply_num: dbCmd.inc(1)
		});
		
	}
	
};


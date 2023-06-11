'use strict';
const jwt = require('jsonwebtoken'); 
const UniSecCheck = require('uni-sec-check');
const db = uniCloud.database();
const dbCmd = db.command;

exports.main = async (event, context) => {
	const dbJQL = uniCloud.databaseForJQL({
		event,
		context
	});
	const openid = jwt.verify(event.token,"secret").openid;
	console.log(openid);
	console.log(context);
	const uniSecCheck = new UniSecCheck({
		provider: "mp-weixin",
		requestId: context.requestId,
	});
	const checkRes = await uniSecCheck.textSecCheck({
		content: event.content, // 文本内容，不可超过500KB
		openid, // 用户的小程序openid
		scene: 2, // 场景值
		version: 2, // 接口版本号
	});
	
	if(checkRes.result.suggest!="pass"){
		return false
	} else{
		
		dbJQL.collection('comment').add({
			"article_id": event.article_id,
			"commenter_id": openid,
			"content": event.content,
			"like_num": 0,
			"reply_num": 0,
		});
		db.collection('article').doc(event.article_id).update({
				comment_num: dbCmd.inc(1)
		})
	}
	
};

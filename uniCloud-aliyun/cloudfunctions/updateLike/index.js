'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const jwt = require('jsonwebtoken');
exports.main = async (event, context) => {
	const openid = jwt.verify(event.token,"secret").openid
	if(event.api==="article"){
		if(event.liked){
		db.collection('article').doc(event.article_id).update({
			like_user_id: dbCmd.push(openid),
			like_num: dbCmd.inc(1)
		});
	} else {
		db.collection('article').doc(event.article_id).update({
			like_user_id: dbCmd.pull(openid),
			like_num: dbCmd.inc(-1)
		})
	}
	} else if(event.api==="comment"){
		if(event.liked){
			db.collection('comment').doc(event.comment_id).update({
				like_user_id: dbCmd.push(openid),
				like_num: dbCmd.inc(1)
			});
		} else {
			db.collection('comment').doc(event.comment_id).update({
				like_user_id: dbCmd.pull(openid),
				like_num: dbCmd.inc(-1)
			})
		}
	} else if(event.api==="reply"){
		if(event.liked){
			db.collection('comment_reply').doc(event.reply_id).update({
				like_user_id: dbCmd.push(openid),
				like_num: dbCmd.inc(1)
			});
		} else {
			db.collection('comment_reply').doc(event.reply_id).update({
				like_user_id: dbCmd.pull(openid),
				like_num: dbCmd.inc(-1)
			})
		}
	}
	
};

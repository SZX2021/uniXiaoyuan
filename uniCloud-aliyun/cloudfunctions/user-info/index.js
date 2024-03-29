'use strict';
let jwt = require("jwt");

const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		token,
		userInfo
	} = event;
	const secret = 'secret';

	//解密token
	try {
		const decoded = await jwt.verifyToken(token);
		const openid = decoded.openid
		//查询id 后更改数据
		await db.collection('user').where({
			_id: openid
		}).update({
			user_name: userInfo.user_name,
			user_avatar: userInfo.user_avatar,
			user_gender: userInfo.user_gender,
			user_signature: userInfo.user_signature
		})
		return 'ok'
	} catch (error) {
		console.error(error.message);
		return error.message
	}









};
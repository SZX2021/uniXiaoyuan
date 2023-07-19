'use strict';

let rp = require("request-promise");
const jwt = require('jwt')

const db = uniCloud.database();

exports.main = async (event, context) => {
  //客户端的参数
  const {
    code,
    avatarUrl,
    nickName
  } = event;
  //微信登录配置
  const SECRET = "自己的";
  const APPID = "自己的"
  let URL =
    `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code `;
  let res = await rp(URL);
  console.log(res);
  if (typeof res === "string") {
    try {
      res = JSON.parse(res);
    } catch (error) {
      console.error("Failed to parse response:", error);
      return error;
    }
  }

  //token加密
  let token = jwt.generateToken({
    openid: res.openid
  });

  //查询用户是否注册
  let user = await db.collection('user')
    .where({
      _id: res.openid,
    })
    .get();
  //判断存在 返回信息和token 则添加数据库	
  if (user.data[0]) {
    return {
      user: user.data[0],
      token,
    };
  } else {

    await db.collection('user').add({
      _id: res.openid,
      user_name: nickName,
      user_avatar: avatarUrl,
      user_gender: '',
      user_phoneNumber: '',
      user_signature: '',
    });
    return {
      user: {
        user_name: nickName,
        user_avatar: avatarUrl,
        user_gender: '',
        user_phoneNumber: '',
        user_signature: '',
      },
      token,
    };
  }

};
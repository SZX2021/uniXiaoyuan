let jwt = require('jsonwebtoken');
let db = uniCloud.database();

// 定义生成 JWT 的函数
function generateToken(payload, secret="secret", options) {
  return jwt.sign(payload, secret, options);
}

// 定义解析 JWT 的函数
function verifyToken(token, secret="secret") {
  return jwt.verify(token, secret);
}

// 导出函数
module.exports = {
  generateToken,
  verifyToken
};
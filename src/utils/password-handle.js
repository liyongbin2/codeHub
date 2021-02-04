const crypto = require('crypto');

const md5password = (password) => {
  // 使用md5加密
  const md5 = crypto.createHash('md5');
  // digest('hex')将密码解析为16进制
  const result = md5.update(password).digest('hex');
  return result;
}

module.exports = md5password;


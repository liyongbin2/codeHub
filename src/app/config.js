// 用于读取.env文件中的信息，最终返回的是一个对象
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// 获取公钥和私钥
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './keys/private.key'));
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './keys/public.key'));

// 一步到位
module.exports = {
  APP_HOST,
  APP_PORT,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env;

// 这里一定要写在最后，写在前面会被覆盖
module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;
const Router = require('koa-router');

const authRouter = new Router();

const {
  login,
  success
} = require('../controller/auth.controller');
const {
  verifyLogin,
  verifyAuth
} = require('../middleware/auth.middleware');

// 登录
authRouter.post('/login', verifyLogin, login);
// 测试
authRouter.get('/test', verifyAuth, success);

module.exports = authRouter;

const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('../app/config');

class AuthController {
  async login (ctx, next) {
    try {
      const { id, name } = ctx.user;
      const token = jwt.sign({ id, name }, PRIVATE_KEY, {
        // 过期时间一天
        expiresIn: 60 * 60 * 24,
        // 使用非对称加密
        algorithm: 'RS256'
      });
      ctx.body = {
        msg: {
          id, name, token
        },
        meta: {
          code: 200
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async success (ctx, next) {
    ctx.body = "授权成功~";
  }
}

module.exports = new AuthController();

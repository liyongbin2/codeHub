const { verify } = require('jsonwebtoken');
const Router = require('koa-router');

const momentRouter = new Router({prefix: '/moment'});

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo
} = require('../controller/moment.controller.js');
const {
  verifyAuth,
  verifyPermission
} = require('../middleware/auth.middleware');
const {
  verifyLabelExists
} = require('../middleware/label.middleware');

// 用户新增动态
momentRouter.post('/', verifyAuth, create);
// 获取动态列表
momentRouter.get('/', list);
// 获取某条动态的详细信息，包括回复内容
momentRouter.get('/:momentId', detail);

// 1.用户必须登录 2.用户具备权限
// 修改评论
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update);
// 删除评论
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove);

// 给动态添加标签
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels);

// 动态配图的服务
momentRouter.get('/images/:filename', fileInfo);

module.exports = momentRouter;

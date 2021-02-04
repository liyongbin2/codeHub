const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('./error-handle');
const useRoutes = require('../router');

const app = new Koa();

// 这里相当于与在app多添加一个useRoutes对象，使得useRoutes中的this指向app也就是koa这对象上
app.useRoutes = useRoutes;

// 用于解析请求中的存在body的数据
app.use(bodyParser());
// 动态获取路由
app.useRoutes();
app.on('error', errorHandler);

module.exports = app;

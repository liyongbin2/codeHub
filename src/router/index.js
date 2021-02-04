const fs = require('fs');


const useRoutes = function() {
  // readdirSync获取当前文件夹下所有文件的名字
  fs.readdirSync(__dirname).forEach(file => {
    if (file === 'index.js') return;
    const router = require(`./${file}`);
    // this指向koa，因为在index文件中使用了app.useRoutes = useRoutes
    this.use(router.routes());
    this.use(router.allowedMethods());
  })
}

module.exports = useRoutes;

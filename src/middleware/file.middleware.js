const path = require('path');

const Multer = require('koa-multer');
// 用于将一张图片提供成不同类型（大小）的图片
const Jimp = require('jimp');
const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path');

const avatarUpload = Multer({
  // 这里的路径是相对于process.avar中的，也就是相当于相对启动服务时所在的入口文件的路径
  dest: AVATAR_PATH
});
const avatarHandler = avatarUpload.single('avatar');

const pictureUpload = Multer({
  dest: PICTURE_PATH
});
const pictureHandler = pictureUpload.array('picture', 9);

const pictureResize = async (ctx, next) => {
  try {
    // 1.获取所有的图像信息
    const files = ctx.req.files;
    // 2.对图像进行处理(sharp/jimp)
    for (let file of files) {
      const destPath = path.join(file.destination, file.filename);
      // 读取文件
      Jimp.read(file.path).then(image => {
        // resize第一个是宽度，第二个是高度，其中高度为自动
        image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
        image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
        image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
      });
    }

    await next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize
}
const service = require("../service/file.service");
const userService = require("../service/user.service");
const { AVATAR_PATH } = require("../constants/file-path");
const {
  APP_HOST,
  APP_PORT
} = require("../app/config");
class FileController {
  async saveAvatarInfo (ctx, next) {
    // 1.获取图片的信息
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;
    // 2.将图像信息保存到数据库中
    const result = await service.createAvatar(filename, mimetype, size, id);
    // 3.将图片地址保存在users表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateAvatarUrlById(avatarUrl, id);
    ctx.body = `上传图片成功~`;
  }

  async savePictureInfo(ctx,next) {
    const files = ctx.req.files;
    const {id} = ctx.user;
    const {momentId} = ctx.query
    for(let file of files) {
      const {filename, mimetype,size} = file;
      await service.createFile(filename, mimetype,size,id,momentId);
    }
    ctx.body = `动图上传成功~`;
  }
}

module.exports = new FileController();
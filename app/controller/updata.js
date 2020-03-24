'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;

module.exports = class extends Controller {
  // 获取上传图片
  async index() {
    const { ctx } = this;
    const upPath = path.join(__dirname, '../public/upload/');
    const stream = await ctx.getFileStream();
    try {
      let type = '.png';
      switch (stream.mime) {
        case 'image/jpeg':
          type = '.jpeg';
          break;
        case 'image/gif':
          type = '.gif';
          break;
        default:
          type = '.png';
      }
      // 更改上传文件名
      const fileName = +new Date() + type;
      // 创建流写
      const writerStream = await fs.createWriteStream(path.join(upPath, fileName));
      try {
        // 异步把文件流 写入
        await awaitWriteStream(stream.pipe(writerStream));
      } catch (err) {
        // 如果出现错误，关闭管道
        await sendToWormhole(stream);
        throw err;
      }
      // 将上传的图片处理成base64g格式
      const imageBase64 = fs.readFileSync(upPath + fileName);
      // 获取二维码文本信息
      const qrInfo = await ctx.service.baidu.index(imageBase64.toString('base64'));
      if (!qrInfo) {
        ctx.body = { code: -1, data: '', msg: '请上传微信定额收款二维码!' };
        return false;
      }
      // 获取二维码识别信息
      const qrCurl = await ctx.service.qrdecode.index(imageBase64);
      qrInfo.qr_url = qrCurl;
      // 查询上传二维码同金额类型是否存在
      const isPrice = await ctx.model.Qrcodes.findAll({ where: { qr_price: qrInfo.qr_price, qr_type: qrInfo.qr_type } });
      if (isPrice.length !== 0) {
        ctx.body = { code: -1, data: '', msg: '此金额的二维码已存在!' };
        return false;
      }
      // 写入数据库
      const insetQrData = await ctx.model.Qrcodes.create(qrInfo);
      if (insetQrData) {
        ctx.body = { code: 0, data: insetQrData, msg: '上传成功!' };
      }
    } catch (e) {
      await sendToWormhole(stream);
    }
  }
};

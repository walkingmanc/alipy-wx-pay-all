'use strict';

const Service = require('egg').Service;
const jsQR = require('jsqr');
const Jimp = require('jimp');

class QrdecodeService extends Service {
  async index(imageBuffer) {
    return new Promise(async (resolve, reject) => {
      await Jimp.read(await imageBuffer, (err, image) => {
        if (err) reject(err);
        const qrCodeImageArray = new Uint8ClampedArray(image.bitmap.data.buffer);
        const qrCodeResult = jsQR(
          qrCodeImageArray,
          image.bitmap.width,
          image.bitmap.height
        );
        if (qrCodeResult) {
          resolve(qrCodeResult.data);
        } else {
          reject('二维码识别失败！');
        }
      });
    });
  }
  async find_pay_url(data, qr_type) {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    return ctx.model.Qrcodes.findAll({
      where: {
        qr_price: {
          [Op.or]: data,
        },
        qr_type,
      },
    });
  }
}

module.exports = QrdecodeService;

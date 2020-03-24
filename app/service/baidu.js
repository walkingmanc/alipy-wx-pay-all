'use strict';

const Service = require('egg').Service;
const AipOcrClient = require('baidu-aip-sdk').ocr;

class BaiduService extends Service {
  async index(image) {
    return new Promise(resolve => {
      const { config: { baidu } } = this;
      const { APP_ID, API_KEY, SECRET_KEY } = baidu;
      // 新建一个对象，建议只保存一个对象调用服务接口
      const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
      client.accurateBasic(image).then(function(result) {
        // 拿到文字识别结果
        const qrData = {};
        result.words_result.forEach(element => { // 识别付款码文字信息
          if (element.words.includes('微信')) {
            qrData.qr_type = 'wechat';
          }
          if (element.words.includes('￥')) {
            qrData.qr_price = element.words.substring(1);
          }
        });
        if (qrData.qr_type !== 'wechat' && qrData.qr_price !== undefined) {
          resolve();
        }
        resolve(qrData);
      }).catch(function() {
        resolve();
      });
    });
  }
}

module.exports = BaiduService;

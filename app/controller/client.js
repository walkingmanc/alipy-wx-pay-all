'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5');

class ClientController extends Controller {
  // 客户端统一错误返回
  async error(e) {
    const { ctx } = this;
    ctx.body = { code: 0, msg: e, data: '', url: '', wait: 3 };
  }
  /**
   *
   * @api { get } /addons/pay/api/setting 验证客户端
   * @apiName 验证客户端
   * @apiGroup android
   * @apiVersion  1.0.1
   * @ApiDescription 验证客户端配置是否正确
   *
   * @apiParam  {String} apiurl 客户端传来的Api地址 格式=> http(s)://服务器地址/addons/pay/ (注意：后面需要"/"结尾，无需带上api/setting)
   * @apiParam  {String} sign 签名密匙，加密方式 md5(md5(apiurl) + secretkey));
   *
   *
  */
  async index() {
    try {
      // 验证客户端配置
      const { ctx, config: { secretkey } } = this;
      const { sign, apiurl } = ctx.query;
      const rule = {
        sign: { type: 'string' },
        apiurl: { type: 'string' },
      };
      // 效验客户端传来的数据
      ctx.validate(rule, { sign, apiurl });
      if (sign !== md5(md5(apiurl) + secretkey)) throw '密匙不正确!';
      // 正确处理
      ctx.body = { code: 1, msg: '配置成功!', data: '', url: '', wait: 3 };
    } catch (e) { this.error(e); }
  }


  /**
   *
   * @api 获取支付中心页面
   * 
   *
   *
  */
 async getPayPage() {
  try {
    const { amt } = ctx.query; 
 

    const data = {
      amount: amt
    };


    await  ctx.render('pc-pay.tpl', data);


  } catch (e) {
     this.error(e);
     }
}



  /**
   *
   * @api { get } /addons/pay/api/notify 接收推送客户端信息
   * @apiName 接收收款信息
   * @apiGroup android
   * @apiVersion  1.0.1
   * @apiDescription 接收安卓推送过来的收款信息，并处理订单状态
   *
   * @apiParam  {String} sign 客户端推送过来的签名 加密方式为 md5(md5(price + type) + secretkey) // 收款金额，收款方式(wechat/alipay)，密匙 注意此处的 + 是字符串拼接
   * @apiParam  {String} type 客户端推送过来的收款方式 wechat/alipay （微信/支付宝）
   * @apiParam  {String} price 客户端推送过来的真实收款金额
   *
   * @apiSuccess (200) {type} name description
   *
   */

  async pay() {
    try {
      // 处理客户端推送过来的信息
      const { ctx, config: { secretkey } } = this;
      const { sign, price, type } = ctx.query;
      const price_float = Math.abs(parseFloat(price));
      // 处理过期订单
      await ctx.service.order.update();
      // 验证信息
      if (sign !== md5(md5(price + type) + secretkey)) throw '处理订单失败，客户端密匙有误!';
      // 处理订单逻辑 TODO //
      const result = await ctx.service.order.save_order(price, type);
      if (!result) {
        console.log('警告：收到订单外的收款信息，收到来自' + type + '金额' + price + '但不是收款系统订单中的付款信息!');
        ctx.body = {
          code: 1,
          msg: '收到了系统订单外的收款',
          data: '',
          url: '/api/notify.html',
          wait: 3,
        };
        return false;
      }
      console.log('通知：收款信息，收到来自' + type + '金额' + price + '的订单，处理完毕!');
      ctx.body = {
        code: 1,
        msg: type === 'wechat' ? '微信支付收款处理成功' : '支付宝收款处理成功',
        data: '',
        url: '/api/notify.html',
        wait: 3,
      };
    } catch (e) { this.error(e); }
  }
}

module.exports = ClientController;

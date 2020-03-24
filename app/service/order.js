'use strict';

const Service = require('egg').Service;
const request = require('request');
const md5 = require('md5');

class OrderService extends Service {
  async update() {
    // 更新未支付订单
    const { ctx, app, config: { orderValidity } } = this;
    const { Op } = app.Sequelize;
    await ctx.model.Orders.update({
      pay_status: '已过期',
    }, {
      where: {
        created_at: {
          [Op.lt]: +new Date() - parseInt(orderValidity) * 60 * 1000,
        },
        pay_status: '未支付',
      },
    });
  }
  async createOrder(qr_url, qr_price) { // 生成支付宝订单
    const { ctx } = this;
    const { order_id, order_type, order_price, sign, order_name, extension, redirect_url,email,serialno } = ctx.request.body;
    return ctx.model.Orders.create({
      order_id,
      order_type,
      order_price,
      sign,
      order_name,
      extension,
      redirect_url,
      qr_url,
      qr_price,
      email,
      serialno
    });
  }
  async find_more_price(data, order_type) {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    return ctx.model.Orders.findAll({
      where: {
        qr_price: {
          [Op.or]: data,
        },
        order_type,
        pay_status: '未支付',
      },
    });
  }
  async save_order(qr_price, order_type) { // 根据客户端推送来的金额和收款方式修改订单状态
    const { ctx, app, config: { orderValidity, secretkey } } = this;
    const { Op } = app.Sequelize;
    try {
      const orderData = await ctx.model.Orders.findOne({
        where: {
          qr_price,
          order_type,
          pay_status: '未支付',
          created_at: {
            [Op.gt]: +new Date() - parseInt(orderValidity) * 60 * 1000,
          },
        },
      });
      const result = await ctx.model.Orders.update({
        pay_status: '已支付',
      }, {
        where: {
          qr_price,
          order_type,
          pay_status: '未支付',
          created_at: {
            [Op.gt]: +new Date() - parseInt(orderValidity) * 60 * 1000,
          },
        },
      });
      if (result[0] === 0) {
        return false;
      }
      const { order_id, qr_price: price, extension, redirect_url } = orderData;
      // sign md5(md5(order_id) + secretkey)
      const sign = md5(md5(order_id) + secretkey);
      const url = redirect_url + '?order_id=' + order_id + '&qr_price=' + price + '&extension=' + extension + '&sign=' + sign;
      await this.get_redirect_url(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  async get_redirect_url(redirect_url) {
    request.get(redirect_url, error => {
      if (error) {
        console.log('收款通知失败,请检查redirect_url是否正确!' + redirect_url);
      } else {
        console.log('收款成功，已通知服务器' + redirect_url);
      }
    });
  }
}

module.exports = OrderService;

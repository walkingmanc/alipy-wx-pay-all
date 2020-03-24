'use strict';

const Controller = require('egg').Controller;

class QrcodeController extends Controller {
  async index() {
    const { ctx } = this;
    const { page } = ctx.request.query;
    try {
      const qrdata = await ctx.model.Qrcodes.findAndCountAll({
        offset: (parseInt(page) - 1) * 10,
        limit: 10,
      });
      ctx.body = { code: 0, data: qrdata, msg: '' };
    } catch (e) {
      ctx.body = { code: -1, data: '', msg: e };
    }
  }
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      await ctx.model.Qrcodes.destroy({ where: { id } });
      ctx.body = { code: 0, data: '', msg: '删除成功!' };
    } catch (e) {
      ctx.body = { code: -1, data: '', msg: e };
    }
  }
}

module.exports = QrcodeController;

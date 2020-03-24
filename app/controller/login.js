'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async create() { // 登录
    try {
      const { ctx, config: { userInfo } } = this;
      const { username, password } = ctx.request.body;
      // 判断登录账号是否正确
      if (userInfo.username === username && userInfo.password === password) {
        ctx.session.name = username;
        ctx.body = { code: 0, data: { username }, msg: '登录成功!' };
      } else {
        throw '登录失败账号或密码不正确!';
      }
    } catch (e) {
      this.ctx.body = { code: -1, data: '', msg: e };
    }
  }
  async index() {
    const { ctx } = this;
    ctx.session.name = null;
    ctx.body = { code: 0, data: '', msg: '退出成功!' };
  }
}

module.exports = LoginController;

'use strict';

module.exports = () => {
  return async function islogin(ctx, next) {
    if (ctx.session.name) {
      await next();
    } else {
      ctx.body = { code: -1, data: '', msg: '未登录!' };
    }
  };
};

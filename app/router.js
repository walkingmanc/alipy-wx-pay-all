'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const islogin = app.middleware.islogin();
  router.get('/addons/pay/api/setting', controller.client.index); // 效验客户端
  router.get('/addons/pay/api/notify', controller.client.pay); // 接收客户端推送信息
  router.resources('login', '/api/login', controller.login);// 登录
  router.post('/api/updata', islogin, controller.updata.index); // 上传二维码
  router.resources('qrcode', '/api/qrcode', islogin, controller.qrcode); // 后台二维码
  router.resources('order', '/api/order', islogin, controller.order); // 后台权限操作订单
  router.post('/api/order', controller.order.create_order); // 新增订单接口


  router.get('/getPay', controller.client.getPayPage); // 获取支付中心页面

  router.get('/login123', controller.public.login);

  router.post('/pcpay', controller.public.pcpay);


};

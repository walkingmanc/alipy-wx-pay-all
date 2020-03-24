'use strict';

module.exports = appInfo => {
  const config = exports = {};


  config.view = {
    defaultViewEngine: 'nunjucks',//默认视图引擎
    mapping: {//.tpl结尾的文件
      '.html': 'nunjucks',
    },
  };

  // 随机修改任意一个值即可
  config.keys = appInfo.name + '_1547540555445_3889';
  // 签名密匙妥善保管，不可泄露，务必修改
  config.secretkey = 'cwMe';
  // 绑定的域名， 务必修改
  config.domain = 'http://192.168.1.104:7001'; // 请指定协议
  // 浏览器打开 http://dev.yio.me/alipayId.html 支付宝扫码获取支付宝userid 或者 pc登录支付宝 https://my.alipay.com/portal/i.htm 右键查看网页源代码搜索 userId 得到的值
  config.alipayUserId = '2088012748271675';
  config.payMax = { // 设置随机立减金额，单位为0.01
    wx: 10, // 表示会在订单金额的基础上最多减免 0.01 * 10,减免的金额必须有对应的收款二维码，否则无法下单!
    alipay: 20, // 支付宝可以任意设置减免金额，无需上传二维码!
  };
  // 设置 修改 订单有效期
  config.orderValidity = 5; // 默认是5分钟 整数
  // 设置 修改 登录用户名和密码，为了节省一张数据表，默认写在配置里
  config.userInfo = {
    username: 'admin', // 账号
    password: 'admin', // 密码
  };
  // 中间件，请勿修改
  config.middleware = [];
  // 修改 mysql信息
  config.sequelize = {
    dialect: 'mysql', // 数据库类型，不要修改
    host: '127.0.0.1', // 数据库地址
    port: 3306,
    username: 'root', // 数据库账号
    password: '114179Cw', // 数据库密码
    database: 'egg', // 数据库名
    timezone: '+08:00',
  };
  // 百度orc 申请地址 http://ai.baidu.com/tech/ocr 务必修改
  config.baidu = {
    // 设置APPID/AK/SK
    APP_ID: '18933517',
    API_KEY: 'qN0WAi30qUNzIijDCvEFFAs4',
    SECRET_KEY: 'YQyxeRlyO8yvXqzbVDlw4IFrE15KKbyN',

  };
  // 验证器，请勿修改
  config.valdate = {

  };
  // 安全防护，请勿修改
  config.security = {
    csrf: {
      enable: false,
    },
  };
  // 使用Nginx转发必须启用
  config.proxy = true;
  // 上传模式请勿修改
  config.multipart = {
    mode: 'stream',
  };
  // 访问前缀，按需修改
  config.static = {
    prefix: '/',
  };
  return config;
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, DECIMAL, STRING, ENUM } = Sequelize;
    await queryInterface.createTable('yio_orders', {
      id: { type: INTEGER(11), primaryKey: true, autoIncrement: true },
      order_id: { type: STRING(50), allowNull: false },
      order_type: { type: ENUM('wechat', 'alipay'), defaultValue: 'wechat', allowNull: false },
      order_price: { type: DECIMAL(7, 2), allowNull: false },
      order_name: { type: STRING(255), allowNull: false },
      pay_status: { type: ENUM('未支付', '已支付', '已过期'), defaultValue: '未支付', allowNull: false },
      qr_url: { type: STRING(255), allowNull: false },
      qr_price: { type: DECIMAL(7, 2), allowNull: false },
      redirect_url: { type: STRING(255), allowNull: false },
      email: { type: STRING(255), allowNull: true },
      serialno: { type: STRING(255), allowNull: true },     
      extension: { type: STRING(255) },
      created_at: { type: DATE, allowNull: false },
      updated_at: { type: DATE, allowNull: false },
      deleted_at: { type: DATE },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('yio_orders');
  },
};

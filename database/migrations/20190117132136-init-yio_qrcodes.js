'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, DECIMAL, STRING, ENUM } = Sequelize;
    await queryInterface.createTable('yio_qrcodes', {
      id: { type: INTEGER(11), primaryKey: true, autoIncrement: true },
      qr_type: { type: ENUM('wechat', 'alipay'), defaultValue: 'wechat', allowNull: false },
      qr_url: { type: STRING(255), allowNull: false },
      qr_price: { type: DECIMAL(7, 2), allowNull: false },
      created_at: { type: DATE, allowNull: false },
      updated_at: { type: DATE, allowNull: false },
      deleted_at: { type: DATE },
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('yio_qrcodes');
  },
};

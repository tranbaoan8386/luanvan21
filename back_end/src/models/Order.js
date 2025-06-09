const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const User = require('./User');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    statusPayment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_payable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tổng tiền cuối cùng (phải trả)',
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullname: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Khớp với DB
      references: {
        model: User,
        key: 'id',
      },
      field: 'users_id', // Quan trọng: map đúng tên cột
    },
  },
  {
    timestamps: false,
    tableName: 'orders',
  }
);

module.exports = Order;

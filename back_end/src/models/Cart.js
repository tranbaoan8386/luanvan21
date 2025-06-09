const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const User = require('./User');

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    users_id: { // ✅ Đổi tên cho khớp bảng
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // ✅ Bảng cho phép null
      defaultValue: false
    }
  },
  {
    tableName: 'carts',
    timestamps: true // ✅ Vì bảng có createdAt, updatedAt
  }
);

module.exports = Cart;

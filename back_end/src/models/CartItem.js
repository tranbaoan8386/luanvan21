const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const Cart = require('./Cart');
const ProductItem = require('./ProductItem');

const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    carts_id: { // ✅ đổi tên theo bảng
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Cart,
        key: 'id'
      }
    },
    products_item_id: { // ✅ đổi tên theo bảng
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductItem,
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true, // vì bảng cho phép null
      defaultValue: 0
    }
  },
  {
    tableName: 'carts_item',
    timestamps: false // ✅ đúng vì bảng không có createdAt, updatedAt
  }
);

module.exports = CartItem;

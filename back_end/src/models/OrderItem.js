const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const Order = require('./Order');
const ProductItem = require('./ProductItem');

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Order,
        key: 'id'
      },
      field: 'orders_id'
    },
    productItemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductItem,
        key: 'id'
      },
      field: 'products_item_id'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price_coupon: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    final_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'orders_item'
    // Không nên dùng paranoid vì bảng không có `deletedAt`
  }
);

module.exports = OrderItem;

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
    carts_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: 'id'
      }
    },
    products_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductItem,
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    tableName: 'carts_item',
    timestamps: false
  }
);



module.exports = CartItem;

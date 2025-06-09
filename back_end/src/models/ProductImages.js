const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const ProductItem = require('./ProductItem'); // 👈 Sửa lại đúng model liên kết

const ProductImages = sequelize.define(
  'ProductImages',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    products_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductItem, // 👈 Phải là ProductItem, không phải Product
        key: 'id'
      },
      defaultValue: null
    }
  },
  {
    timestamps: false,
    tableName: 'product_images'
  }
);

module.exports = ProductImages;

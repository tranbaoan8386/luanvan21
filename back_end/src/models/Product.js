const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');

const Category = require('./Category');
const Brand = require('./Brand');
const ProductItem = require('./ProductItem');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    categories_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: 'id'
      },
      defaultValue: null
    },
    brands_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Brand,
        key: 'id'
      },
      defaultValue: null
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    }
  },
  {
    timestamps: false,
    tableName: 'products'
  }
);



module.exports = Product;

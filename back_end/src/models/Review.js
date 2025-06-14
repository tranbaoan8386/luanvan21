const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const Product = require('./Product');
const User = require('./User');

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'content' // ánh xạ đúng cột trong DB
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Product,
        key: 'id'
      },
      field: 'products_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      },
      field: 'users_id'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'parent_id' // ánh xạ đúng cột trong DB
    }
  },
  {
    tableName: 'reviews',
    timestamps: false
  }
);

module.exports = Review;

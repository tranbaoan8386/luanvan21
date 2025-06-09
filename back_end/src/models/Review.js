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
      field: 'content' // ✅ map đúng tên cột trong DB
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
      field: 'products_id' // ✅ map đúng tên cột
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      },
      field: 'users_id' // ✅ map đúng tên cột
    }
    // ❌ Không thêm parentId nếu DB chưa có, hoặc phải thêm vào DB nếu muốn hỗ trợ reply
  },
  {
    tableName: 'reviews',
    timestamps: false
  }
);

module.exports = Review;

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');

const Brand = sequelize.define(
  'Brand',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true // ✅ DB cho phép NULL
    }
  },
  {
    tableName: 'brands',
    timestamps: false // ✅ DB không có createdAt, updatedAt
  }
);

module.exports = Brand;

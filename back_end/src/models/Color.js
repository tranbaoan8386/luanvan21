const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');

const Color = sequelize.define(
  'Color',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10), // ✅ Giới hạn độ dài
      allowNull: true              // ✅ Phù hợp với DEFAULT NULL trong DB
    },
    colorCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'colors'
  }
);

module.exports = Color;

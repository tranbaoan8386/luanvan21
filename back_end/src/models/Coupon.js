const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');

const Coupon = sequelize.define(
  'Coupon',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true,       // ✅ Phù hợp với DB
      unique: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true        // ✅ Phù hợp với DB
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    timestamps: false,
    tableName: 'coupons'
  }
);

module.exports = Coupon;

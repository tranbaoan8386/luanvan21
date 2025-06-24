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
      allowNull: true,
      unique: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // ✅ THÊM DÒNG NÀY
    minimumAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    }
  },
  {
    timestamps: false,
    tableName: 'coupons'
  }
);

module.exports = Coupon;

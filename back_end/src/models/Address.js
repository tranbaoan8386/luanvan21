const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const User = require('./User')

const Address = sequelize.define(
  'Address',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    address_line: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ward: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    users_id: { // ❗️Phải trùng tên với DB nếu không dùng `foreignKey` trong associate
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  },
  {
    tableName: 'address',
    timestamps: true // ✅ Bật để Sequelize quản lý createdAt, updatedAt
  }
)

module.exports = Address

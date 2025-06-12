const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const User = require('./User');

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    },
    // ✅ Thêm alias userId để dùng trong code JS
    userId: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('users_id');
      },
      set(value) {
        this.setDataValue('users_id', value);
      }
    },
    isPaid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  },
  {
    tableName: 'carts',
    timestamps: true
  }
);

module.exports = Cart;

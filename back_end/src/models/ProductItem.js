const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');

const ProductItem = sequelize.define('ProductItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  unitInStock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    field: 'unitInStock'
  },
  products_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'products', // 👉 Dùng tên bảng thay vì biến
      key: 'id'
    }
  },
  coupons_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'coupons',
      key: 'id'
    }
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  sold: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  color_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'colors',
      key: 'id'
    }
  },
  size_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sizes',
      key: 'id'
    }
  },
  materials_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'materials',
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'products_item'
});

module.exports = ProductItem;

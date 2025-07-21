// Import các kiểu dữ liệu từ Sequelize
const { DataTypes } = require('sequelize');

// Kết nối với cơ sở dữ liệu đã cấu hình sẵn
const sequelize = require('../database/connectMysql');

// Định nghĩa model ProductItem, tương ứng với bảng `products_item`
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
      model: 'products',          
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

// Xuất model để sử dụng ở controller hoặc associations
module.exports = ProductItem;

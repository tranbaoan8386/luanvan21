// Import kiểu dữ liệu từ Sequelize
const { DataTypes } = require('sequelize');

// Kết nối Sequelize với MySQL (file connectMysql.js là nơi cấu hình database)
const sequelize = require('../database/connectMysql');

// Import các model liên quan để thiết lập quan hệ (foreign key)
const Category = require('./Category');
const Brand = require('./Brand');
const ProductItem = require('./ProductItem');

// Định nghĩa model Product tương ứng với bảng 'products' trong database
const Product = sequelize.define(
  'Product', // Tên model
  {
    id: {
      type: DataTypes.INTEGER,     // Kiểu INT
      autoIncrement: true,         // Tự động tăng
      primaryKey: true             // Khóa chính
    },
    name: {
      type: DataTypes.STRING(255), // VARCHAR(255)
      allowNull: true,             // Có thể rỗng
      defaultValue: null           // Mặc định là null
    },
    description: {
      type: DataTypes.TEXT,        // TEXT (dùng cho mô tả dài)
      allowNull: true,
      defaultValue: null
    },
    categories_id: {
      type: DataTypes.INTEGER,     // ID danh mục (foreign key)
      allowNull: true,
      references: {
        model: Category,           // Liên kết với model Category
        key: 'id'                  // Khóa chính của Category
      },
      defaultValue: null
    },
    brands_id: {
      type: DataTypes.INTEGER,     // ID thương hiệu (foreign key)
      allowNull: true,
      references: {
        model: Brand,              // Liên kết với model Brand
        key: 'id'                  // Khóa chính của Brand
      },
      defaultValue: null
    },
    avatar: {
      type: DataTypes.STRING(255), // Đường dẫn ảnh đại diện
      allowNull: true,
      defaultValue: null
    }
  },
  {
    tableName: 'products',
    timestamps: true,         // BẮT BUỘC phải bật để Sequelize thêm deletedAt
    createdAt: false,         // Tắt createdAt
    updatedAt: false,         // Tắt updatedAt
    paranoid: true,           // Bật xóa mềm
    deletedAt: 'deletedAt'    // Đặt tên cột deletedAt
    
  }
);

// Export model để sử dụng ở các nơi khác (controllers, associations, ...)
module.exports = Product;

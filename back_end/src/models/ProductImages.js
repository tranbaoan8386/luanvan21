// Import các kiểu dữ liệu cần thiết từ Sequelize
const { DataTypes } = require('sequelize');

// Import kết nối cơ sở dữ liệu Sequelize đã cấu hình
const sequelize = require('../database/connectMysql');

// Import model ProductItem để định nghĩa liên kết foreign key
const ProductItem = require('./ProductItem'); // 👈 Liên kết đến bảng products_item

// Định nghĩa model ProductImages tương ứng với bảng `product_images` trong cơ sở dữ liệu
const ProductImages = sequelize.define(
  'ProductImages',
  {
    id: {
      type: DataTypes.INTEGER,      // Trường kiểu số nguyên
      autoIncrement: true,          // Tự động tăng giá trị khi thêm mới
      primaryKey: true              // Là khóa chính của bảng
    },
    url: {
      type: DataTypes.STRING(255),  // Đường dẫn ảnh (tối đa 255 ký tự)
      allowNull: true,              // Có thể để trống
      defaultValue: null            // Nếu không truyền vào, giá trị mặc định là null
    },
    products_item_id: {
      type: DataTypes.INTEGER,      // Trường foreign key liên kết đến bảng products_item
      allowNull: true,              // Có thể null nếu ảnh chưa gắn với item nào
      references: {
        model: ProductItem,         // 👈 Model liên kết: bảng products_item
        key: 'id'                   // Trường liên kết: id của bảng products_item
      },
      defaultValue: null            // Mặc định là null
    }
  },
  {
    timestamps: false,              // Không tự động thêm createdAt và updatedAt
    tableName: 'product_images'     // Tên bảng thật trong cơ sở dữ liệu
  }
);

// Export model ra ngoài để sử dụng ở controller hoặc tạo liên kết với các model khác
module.exports = ProductImages;

// Import các kiểu dữ liệu từ Sequelize
const { DataTypes } = require('sequelize');

// Kết nối với cơ sở dữ liệu đã cấu hình sẵn
const sequelize = require('../database/connectMysql');

// Định nghĩa model ProductItem, tương ứng với bảng `products_item`
const ProductItem = sequelize.define('ProductItem', {
  id: {
    type: DataTypes.INTEGER,       // Trường kiểu số nguyên
    autoIncrement: true,           // Tự động tăng
    primaryKey: true               // Là khóa chính
  },
  unitInStock: {
    type: DataTypes.INTEGER,       // Số lượng tồn kho
    allowNull: true,               // Cho phép để trống
    defaultValue: null,            // Giá trị mặc định là null
    field: 'unitInStock'           // Tên trường trong CSDL là `unitInStock` (nếu khác với key JS)
  },
  products_id: {
    type: DataTypes.INTEGER,       // Liên kết với bảng `products`
    allowNull: true,
    references: {
      model: 'products',           // 👈 tên bảng trong database
      key: 'id'                    // Trường liên kết (khóa chính bên bảng products)
    }
  },
  coupons_id: {
    type: DataTypes.INTEGER,       // ID mã giảm giá
    allowNull: true,
    references: {
      model: 'coupons',            // Bảng coupons
      key: 'id'
    }
  },
  price: {
    type: DataTypes.INTEGER,       // Giá tiền
    allowNull: true,
    defaultValue: 0                // Mặc định là 0 nếu không có
  },
  sold: {
    type: DataTypes.INTEGER,       // Số lượng đã bán
    allowNull: true                // Có thể null
  },
  color_id: {
    type: DataTypes.INTEGER,       // Màu sắc
    allowNull: true,
    references: {
      model: 'colors',             // Bảng `colors`
      key: 'id'
    }
  },
  size_id: {
    type: DataTypes.INTEGER,       // Kích thước
    allowNull: true,
    references: {
      model: 'sizes',              // Bảng `sizes`
      key: 'id'
    }
  },
  materials_id: {
    type: DataTypes.INTEGER,       // Chất liệu
    allowNull: true,
    references: {
      model: 'materials',          // Bảng `materials`
      key: 'id'
    }
  }
}, {
  timestamps: false,               // Không tự động tạo trường createdAt, updatedAt
  tableName: 'products_item'       // Tên bảng thật trong database
});

// Xuất model để sử dụng ở controller hoặc associations
module.exports = ProductItem;

"use strict";

// Import các module cần thiết
const fs = require("fs");                    // Đọc file trong thư mục
const path = require("path");                // Xử lý đường dẫn file
const Sequelize = require("sequelize");      // ORM Sequelize
const process = require("process");          // Truy cập biến môi trường

// Lấy tên file hiện tại (ví dụ index.js) để tránh load lại chính nó
const basename = path.basename(__filename);

// Xác định môi trường hiện tại (development, production, v.v.)
const env = process.env.NODE_ENV || "development";

// Load cấu hình kết nối từ file config/config.json theo môi trường
const config = require(__dirname + "/../config/config.json")[env];

// Khởi tạo object db để chứa tất cả model
const db = {};

// Khởi tạo kết nối Sequelize
let sequelize;
if (config.use_env_variable) {
  // Nếu config yêu cầu dùng biến môi trường
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Nếu không, dùng username, password, database từ config.json
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Ghi log ra console để debug thông tin kết nối
console.log("Sequelize Config:", config);

// Đọc tất cả các file trong thư mục models (trừ index.js và relationship.js)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&                 // Bỏ file ẩn (.DS_Store, .env, v.v.)
      file !== basename &&                       // Bỏ chính file index.js
      file !== "relationship.js" &&              // Bỏ file khai báo quan hệ (load riêng ở dưới)
      file.slice(-3) === ".js" &&                // Chỉ lấy file .js
      file.indexOf(".test.js") === -1            // Bỏ qua file test
    );
  })
  .forEach((file) => {
    try {
      const modelPath = path.join(__dirname, file);       // Lấy đường dẫn đầy đủ đến file
      const model = require(modelPath)(sequelize, Sequelize.DataTypes); // Gọi hàm export từ model

      if (model && model.name) {
        db[model.name] = model;  // Thêm model vào object db
      } else {
        console.error(`Failed to load model from ${file}: Invalid model definition`);
      }
    } catch (error) {
      console.error(`Error loading model ${file}:`, error);
    }
  });

// Nếu model có phương thức associate (liên kết với bảng khác) thì gọi
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db); // Gọi hàm associate(modelList)
    } catch (error) {
      console.error(`Error setting up associations for ${modelName}:`, error);
    }
  }
});

// Gắn thêm Sequelize và instance sequelize vào object db để export ra ngoài
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sau khi tất cả model đã load xong, mới gọi file `relationship.js` để định nghĩa các liên kết
try {
  require('./relationship')(db);
} catch (error) {
  console.error("Error loading relationships:", error);
}

// Export db (chứa tất cả model + kết nối) ra ngoài
module.exports = db;

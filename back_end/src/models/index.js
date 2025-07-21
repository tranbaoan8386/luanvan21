"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// ✅ Load tất cả model theo dạng export trực tiếp object (kiểu bài cũ)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file !== "relationship.js" &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    try {
      const modelPath = path.join(__dirname, file);
      const model = require(modelPath); // ✅ không gọi như function

      if (model && model.name) {
        db[model.name] = model;
      } else {
        const name = file.replace(".js", "");
        db[name] = model;
      }
    } catch (error) {
      console.error(`❌ Lỗi khi load model từ file ${file}:`, error.message);
    }
  });

// ✅ KHÔNG gọi như function (vì relationship.js chỉ đơn giản là require)
try {
  require("./relationship");
} catch (error) {
  console.error("❌ Lỗi khi load relationship.js:", error.message);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

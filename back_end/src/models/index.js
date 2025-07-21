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

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file !== "relationship.js" &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);
    const modelModule = require(modelPath);

    try {
      let model;

      // Nếu model export ra là class kế thừa Sequelize.Model và có hàm init thì gọi init
      if (
        typeof modelModule === "function" &&
        modelModule.prototype instanceof Sequelize.Model &&
        typeof modelModule.init === "function"
      ) {
        model = modelModule.init(sequelize, Sequelize.DataTypes);
      } 
      // Nếu export là function kiểu cũ thì gọi trực tiếp
      else if (typeof modelModule === "function") {
        model = modelModule(sequelize, Sequelize.DataTypes);
      }

      if (model && model.name) {
        db[model.name] = model;
      } else {
        console.error(`❌ Không thể load model từ file ${file}: Sai định dạng hoặc thiếu tên`);
      }
    } catch (error) {
      console.error(`❌ Lỗi khi load model từ file ${file}:`, error.message);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (err) {
      console.error(`❌ Lỗi khi gọi associate của model ${modelName}:`, err.message);
    }
  }
});

try {
  require("./relationship")(db);
} catch (error) {
  console.error("❌ Lỗi khi load relationship.js:", error.message);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

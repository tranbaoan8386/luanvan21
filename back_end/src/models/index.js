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

console.log("Sequelize Config:", config);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file !== "relationship.js" && // Exclude relationship.js from model loading
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    try {
      const modelPath = path.join(__dirname, file);
      const model = require(modelPath)(sequelize, Sequelize.DataTypes);
      if (model && model.name) {
        db[model.name] = model;
      } else {
        console.error(`Failed to load model from ${file}: Invalid model definition`);
      }
    } catch (error) {
      console.error(`Error loading model ${file}:`, error);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (error) {
      console.error(`Error setting up associations for ${modelName}:`, error);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load relationships after models are initialized
try {
  require('./relationship')(db);
} catch (error) {
  console.error("Error loading relationships:", error);
}

module.exports = db;
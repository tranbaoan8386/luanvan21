const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');

const Material = sequelize.define(
  'Material',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true // Vì DB cho phép NULL
    }
  },
  {
    tableName: 'materials',
    timestamps: false
  }
);

module.exports = Material;

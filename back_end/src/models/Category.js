const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');

const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'categories',
        timestamps: false // Tắt tính năng timestamps
    }
);

module.exports = Category;

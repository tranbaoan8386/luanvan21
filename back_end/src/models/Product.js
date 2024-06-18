const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const Coupon = require('./Coupon');

// Import Category sau khi nó được định nghĩa
const Category = require('./Category');

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        sold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Category,
                key: 'id'
            }
        },
        productCouponId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Coupon,
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        tableName: 'products'
    }
);

module.exports = Product;

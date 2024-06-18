const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const Product = require('./Product')
const ProductImages = sequelize.define(
    'ProductImages',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Product,
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        tableName: 'product_Images'
    }
)

module.exports = ProductImages

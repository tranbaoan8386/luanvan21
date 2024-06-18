const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const Product = require('./Product')
const Color = require('./Color')

const ProductItem = sequelize.define(
    'ProductItem',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        unitlnStock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: 'id'
            }
        },
        colorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Color,
                key: 'id'
            }
        }
    },
    {
        timestamps: false,
        tableName: 'Products_item'
    }
)

module.exports = ProductItem

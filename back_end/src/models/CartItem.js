const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const Cart = require('./Cart')
const Product = require('./Product')
const Color = require('./Color.js')
const ProductItem = require('./ProductItem')
const CartItem = sequelize.define(
    'CartItem',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Cart,
                key: 'id'
            }
        },
        ProductItemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ProductItem,
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
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: 'carts_item'
    }
)

module.exports = CartItem

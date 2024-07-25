const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const Order = require('./Order')
const products_item = require('./ProductItem')

const OrderItem = sequelize.define(
    'OrderItem',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Order,
                key: 'id'
            }
        },
        productItemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: products_item,
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'orders-tem',
        paranoid: true
    }
)

module.exports = OrderItem

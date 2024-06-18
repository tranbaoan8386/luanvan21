const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const User = require('./User')
const Coupon = require('./Coupon')

const Cart = sequelize.define(
    'Cart',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },

        isPaid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        couponId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Coupon,
                key: 'id'
            }
        }
    },
    {
        tableName: 'carts'
    }
)

module.exports = Cart

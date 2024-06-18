const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const User = require('./User')

const Order = sequelize.define(
    'Order',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // pending, shipped, delivered, cancelled
        statusPayment: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        total: {
            type: DataTypes.INTEGER,

        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        }, email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
    },
    {
        timestamps: false,
        tableName: 'orders',
        paranoid: true
    }
)

module.exports = Order

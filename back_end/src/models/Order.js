const { DataTypes } = require('sequelize');
const sequelize = require('../database/connectMysql');
const User = require('./User');

const Order = sequelize.define(
    'Order',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        statusPayment: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        total: {
            type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for monetary values
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        createDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        timestamps: false, // Enable timestamps
        paranoid: true, // Enable paranoid (soft delete)
        tableName: 'orders',
    }
);

module.exports = Order;

const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')

const Coupon = sequelize.define(
    'Coupon',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,

        },
        endDate: {
            type: DataTypes.DATE,

        }
    }, {

    timestamps: false,
    tableName: 'coupons'
}
)

module.exports = Coupon

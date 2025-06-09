const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')

const Size = sequelize.define(
    'Size',
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
        timestamps: false,
        tableName: 'sizes'
    }
)

module.exports = Size

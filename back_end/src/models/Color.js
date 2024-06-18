const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')

const Color = sequelize.define(
    'Color',
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
        tableName: 'colors'
    }
)

module.exports = Color

const { DataTypes } = require('sequelize')
const sequelize = require('../database/connectMysql')
const Role = require('./Role')

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        role: {
            defaultValue: 'customer',
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Role,
                key: 'slug'
            }
        }
    },
    {
        tableName: 'users'
    }
)
module.exports = User

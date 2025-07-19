const { Sequelize } = require('sequelize')
const { env } = require('../config/env')

const sequelize = new Sequelize(env.MYSQL_DATABASE, env.MYSQL_USER, env.MYSQL_PASSWORD, {
    logging: false,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: env.SEQUELIZE_DIALECT,
})

module.exports = sequelize

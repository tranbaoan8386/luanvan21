
const sequelize = require('./connectMysql')
const connectMongo = require('./connectMongo')

const connectToMysql = async () => {
    try {
        sequelize.authenticate()
        console.log('Connected mysql successfully')
    } catch (err) {
        console.log('Failed to connect mysql')
    }
}



connectToMysql()

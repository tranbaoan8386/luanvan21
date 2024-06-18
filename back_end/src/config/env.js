require('dotenv').config()
exports.env = {
    PORT: process.env.PORT || 3009,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3009',
    EXPIRED_IN: process.env.EXPIRED_IN || 86400,
    SECRET_KEY: process.env.SECRET_KEY || 'myle',
    EXPIRE_AFTER_SECONDS: process.env.EXPIRE_AFTER_SECONDS || 900,
    MONGO_HOST: process.env.MONGO_HOST || 'localhost',
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_DATABASE: process.env.MONGO_DATABASE,
    MONGO_USERNAME: process.env.MONGO_USERNAME,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,

    SEQUELIZE_DIALECT: process.env.SEQUELIZE_DIALECT || 'mysql',
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_PORT: process.env.MYSQL_PORT || 3306,
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'luanvan3',

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'myle',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'myle',
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || 'myle',
    GOOGLE_TEST_EMAIL: process.env.GOOGLE_TEST_EMAIL || 'test@gmail.com',

    FILE_LIMIT: process.env.FILE_LIMIT || 5, // 5MB




}

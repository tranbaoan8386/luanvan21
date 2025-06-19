require('dotenv').config()
exports.env = {
    PORT: process.env.PORT || 3306,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:8000',
    CLIENT_ID: process.env.CLIENT_ID || 'AZD3dlJ0PJwZlq4KOZ4D9CWX0ZuCgQ5LmfHpae9XT8jNcyc66bniHDHJnQoseyQNU8ZyWixnkxaronxA',
    EXPIRED_IN: process.env.EXPIRED_IN || 86400,
    SECRET_KEY: process.env.SECRET_KEY || 'baoan',
    EXPIRE_AFTER_SECONDS: process.env.EXPIRE_AFTER_SECONDS || 900,
    MONGO_HOST: process.env.MONGO_HOST || 'localhost',
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_DATABASE: process.env.MONGO_DATABASE,
    MONGO_USERNAME: process.env.MONGO_USERNAME,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    BCRYPT_SALT_ROUND: 10,
    SEQUELIZE_DIALECT: process.env.SEQUELIZE_DIALECT || 'mysql',
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_PORT: process.env.MYSQL_PORT || 3306,
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'luanvann',

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'baoan',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'baoan',
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN || 'baoan',
    GOOGLE_TEST_EMAIL: process.env.GOOGLE_TEST_EMAIL || 'tranbaoan20102002@gmail.com',
    EMAIL_SECURE: 'false',
    FILE_LIMIT: process.env.FILE_LIMIT || 5, // 5MB
    MAIL_MAILER: 'smtp',
    MAIL_HOST: 'smtp.gmail.com',
    MAIL_PORT: 587,
    MAIL_USERNAME: 'quanghuy110303@gmail.com',
    MAIL_PASSWORD: 'pyblqyokldgjuwxv',
    MAIL_ENCRYPTION: 'TLS',
    MAIL_FROM_ADDRESS: 'tranbaoan20@gmail.com',
    MAIL_FROM_NAME: "${APP_NAME}"





}

const { env } = require('./env');
require('dotenv').config();

module.exports = {
    MAILER: env.MAIL_MAILER,
    HOST: env.MAIL_HOST,
    PORT: env.MAIL_PORT,
    USERNAME: env.MAIL_USERNAME,
    PASSWORD: env.MAIL_PASSWORD,
    ENCRYPTION: env.MAIL_ENCRYPTION, // ✅ sửa đúng
    FROM_ADDRESS: env.MAIL_FROM_ADDRESS,
    FROM_NAME: env.MAIL_FROM_NAME,
    SECURITY: env.EMAIL_SECURE === 'true' // ✅ chuyển sang boolean
};

const nodemailer = require('nodemailer')
const maiConfig = require('../config/mail.config');
const mailConfig = require('../config/mail.config');
require('dotenv').config();
exports.sendMail = (to, subject, htmlContent) => {

    const transport = nodemailer.createTransport({

        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: mailConfig.SECURITY === true,
        auth: {
            user: mailConfig.USERNAME,
            pass: mailConfig.PASSWORD
        }
    })


    const options = {

        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        html: htmlContent

    }
    return transport.sendMail(options)
}

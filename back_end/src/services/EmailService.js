const { env } = require('../config/env')
const generateOAuthAccessToken = require('../utils/generateOAuthAccessToken')
const nodemailer = require('nodemailer')
class EmailService {
    constructor() {
        this.initTransport()
    }

    initTransport() {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET
            }
        })
    }
    async sendMail({ to, subject, html }) {
        const accessToken = await generateOAuthAccessToken()
        this.transport.sendMail({
            from: `Phone Store <${env.GOOGLE_TEST_EMAIL}>`,
            to,
            subject,
            html,
            auth: {
                user: env.GOOGLE_TEST_EMAIL,
                refreshToken: env.GOOGLE_REFRESH_TOKEN,
                accessToken
            }
        })
    }
}

module.exports = new EmailService()

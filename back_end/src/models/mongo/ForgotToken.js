const { default: mongoose } = require('mongoose')
const { env } = require('../../config/env')

const ForgotToken = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        token: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

ForgotToken.index({ createdAt: 1 }, { expireAfterSeconds: env.EXPIRE_AFTER_SECONDS })

module.exports = mongoose.model('forgot_token', ForgotToken)

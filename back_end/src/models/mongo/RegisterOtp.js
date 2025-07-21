/* const mongoose = require('mongoose')
const { env } = require('../../config/env')

const RegisterOtp = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        otp: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

RegisterOtp.index({ createdAt: 1 }, { expireAfterSeconds: env.EXPIRE_AFTER_SECONDS })

module.exports = mongoose.model('register_otp', RegisterOtp)
 */
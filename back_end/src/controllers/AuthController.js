const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const generateOtp = require('../utils/generateOtp')
const RegisterOtp = require('../models/mongo/RegisterOtp')
const EmailService = require('../services/EmailService')
const ForgotToken = require('../models/mongo/ForgotToken')
const randomBytes = require('../utils/randomBytes')
const { env } = require('../config/env')
class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body

            // Kiểm tra email có tồn tại trong hệ thống
            const isExistEmail = await User.findOne({
                where: { email }
            })

            // nên điều chỉnh lại
            if (isExistEmail) {
                return ApiResponse.error(res, {
                    data: {
                        email: 'Email đã tồn tại'
                    }
                })
            }

            // Mã hóa mật khẩu
            const hashedPassword = bcrypt.hashSync(password)
            // Tạo người dùng
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            })

            // Tạo mã otp
            const otp = generateOtp()
            const registerOtp = new RegisterOtp({
                email,
                otp
            })

            await Promise.all([
                registerOtp.save()
                // Gửi email
                // EmailService.sendMail({
                //     to: email,
                //     subject: 'Xác thực đăng ký',
                //     html: `Mã xác thực đăng ký: ${otp}`
                // })
            ])

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    message: 'Đăng ký tài khoản thành công',
                    user
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body

            // Kiểm tra email có tồn tại trong hệ thống
            const user = await User.findOne({
                where: { email }
            })
            if (!user) {
                return ApiResponse.error(res, {
                    data: {
                        email: 'Người dùng không tồn tại trong hệ thống'
                    }
                })
            }
            // Kiểm tra xác thực
            // if (!user.verified) {
            //     throw new ErrorResponse(401, 'Tài khoàn chưa được xác thực')
            // }
            // Kiểm tra mật khẩu đúng
            const isMatchPassword = bcrypt.compareSync(password, user.password)
            if (!isMatchPassword) {
                //  Điều chỉnh
                return ApiResponse.error(res, {
                    data: {
                        password: 'Mật khẩu chưa chính xác'
                    }
                })
            }
            // Tạo token
            const token = jwt.sign(
                {
                    id: user.id
                },
                env.SECRET_KEY,
                {
                    // expiresIn 5 days
                    expiresIn: '5d'
                }
            )

            const userFinal = {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                id: user.id
            }
            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: 'Đăng nhập thành công',
                    user: userFinal,
                    token
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async verifyOtp(req, res, next) {
        try {
            const { otp, email } = req.body

            const user = await RegisterOtp.findOne({ email })
            if (!user) {
                throw new ErrorResponse(404, 'Mã xác thực không tồn tại hoặc đã hết hạn')
            }
            if (user.otp !== otp) {
                throw new ErrorResponse(401, 'Mã xác thực không đúng')
            }

            await Promise.all([
                User.update(
                    {
                        verified: true
                    },
                    {
                        where: {
                            email
                        }
                    }
                ),
                RegisterOtp.deleteOne({ email })
            ])

            return new ApiResponse(res, {
                status: 200,
                message: 'Xác thực thành công'
            })
        } catch (err) {
            next(err)
        }
    }

    async resendOtp(req, res, next) {
        try {
            const { email } = req.body
            await RegisterOtp.deleteOne({ email })

            // Gửi lại mã
            const otp = generateOtp()
            const registerOtp = new RegisterOtp({
                email,
                otp
            })
            await Promise.all([
                registerOtp.save()
                // Gửi email
                // EmailService.sendMail({
                //     to: email,
                //     subject: 'Yêu cầu gửi lại mã xác thực',
                //     html: `Mã xác thực mới của bạn là: ${otp}`
                // })
            ])
            return new ApiResponse(res, {
                status: 200,
                message: 'Gửi lại mã xác thực thành công'
            })
        } catch (err) {
            next(err)
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body
            const existedToken = await ForgotToken.findOne({ email })

            // kiểm tra tồn tại token đó chưa
            if (existedToken) {
                throw new ErrorResponse(409, 'Vui lòng kiểm tra email')
            }

            const user = await User.findOne({
                where: { email }
            })
            if (!user) {
                throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống')
            }

            // Tạo token
            const token = randomBytes(32)
            const forgotToken = new ForgotToken({
                email,
                token
            })

            const link = `${env.CLIENT_URL}/forgot-password/${token}`

            await Promise.all([
                forgotToken.save()
                // // Gửi email
                // EmailService.sendMail({
                //     to: email,
                //     subject: 'Yêu cầu quên mật khẩu',
                //     html: `<h1> CLick <a href="${link}">Here</a> to reset password!</h1>`
                // })
            ])

            return new ApiResponse(res, {
                status: 200,
                message: 'Vui lòng kiểm tra email để khôi phục mật khẩu'
            })
        } catch (err) {
            next(err)
        }
    }

    async verifyForgotToken(req, res, next) {
        try {
            const { token } = req.body
            const existedToken = await ForgotToken.findOne({ token })
            if (!existedToken) {
                throw new ErrorResponse(404, 'Token không tồn tại')
            }
            return new ApiResponse(res, {
                status: 200,
                message: 'Xác thực thành công'
            })
        } catch (err) {
            next(err)
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email, token, newPassword } = req.body
            const existedToken = await ForgotToken.findOne({ token })
            if (!existedToken) {
                throw new ErrorResponse(404, 'Token không tồn tại')
            }
            const hashedPassword = bcrypt.hashSync(newPassword)

            await Promise.all([
                User.update(
                    {
                        password: hashedPassword
                    },
                    {
                        where: { email }
                    }
                ),
                ForgotToken.deleteOne({
                    email
                })
            ])
            return new ApiResponse(res, {
                status: 200,
                message: 'Khôi phục mật khẩu thành công'
            })
        } catch (err) {
            next(err)
        }
    }

    async resendForgotToken(req, res, next) {
        try {
            const { email } = req.body
            await ForgotToken.deleteOne({ email })

            const user = await User.findOne({
                where: { email }
            })
            if (!user) {
                throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống')
            }

            // Tạo token
            const token = randomBytes(32)
            const forgotToken = new ForgotToken({
                email,
                token
            })

            const link = `${env.CLIENT_URL}/forgot-password/${token}`

            await Promise.all([
                forgotToken.save()
                // Gửi email
                // EmailService.sendMail({
                //     to: email,
                //     subject: 'Yêu cầu quên mật khẩu',
                //     html: `<h1> CLick <a href="${link}">Here</a> to reset password!</h1>`
                // })
            ])

            return new ApiResponse(res, {
                status: 200,
                message: 'Vui lòng kiểm tra email để khôi phục mật khẩu'
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AuthController()

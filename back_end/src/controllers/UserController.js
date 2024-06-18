const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const { env } = require('../config/env')
const { Op } = require('sequelize')

class UserController {
    async getAll(req, res, next) {
        try {
            const { id: userId, role } = req.user

            let users = []

            if (role === 'customer') {
                users = await User.findAll({
                    where: {
                        role: {
                            [Op.notIn]: ['customer', 'admin']
                        }
                    }
                })
            }

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    users
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getMe(req, res, next) {
        try {
            const { id: userId } = req.user
            const user = await User.findByPk(userId, {
                attributes: {
                    exclude: ['password']
                },

            })
            return ApiResponse.success(res, {
                success: true,
                data: {
                    profile: user
                }
            })
        } catch (err) {
            next(err)
        }
    }
    async getUser(req, res, next) {
        try {
            const { id: userId } = req.params
            const user = await User.findByPk(userId)
            if (!user) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy user'
                    }
                })
            }
            return ApiResponse.success(res, {
                status: 200,
                data: user
            })
        } catch (err) {
            next(err)
        }
    }

    async updateMe(req, res, next) {
        try {
            const { name, phone, province, district, village, shortDescription } = req.body

            const { id: userId } = req.user
            const existedAddress = await Address.findOne({
                where: {
                    userId
                }
            })

            if (existedAddress) {
                // Cập nhật chỉ những trường có giá trị mới được nhập

                existedAddress.phone = phone || existedAddress.phone
                existedAddress.province = province || existedAddress.province
                existedAddress.district = district || existedAddress.district
                existedAddress.village = village || existedAddress.village
                existedAddress.shortDescription = shortDescription || existedAddress.shortDescription

                await existedAddress.save()
            } else {
                // Tạo mới nếu chưa có thông tin địa chỉ
                await Address.create({
                    userId,
                    phone,
                    province,
                    district,
                    village,
                    shortDescription
                })
            }
            if (name !== undefined && name !== null && name !== '') {
                await User.update(
                    {
                        name
                    },
                    {
                        where: {
                            id: userId
                        }
                    }
                )
            }

            if (req.file) {
                const { filename } = req.file
                await User.update(
                    {
                        avatar: filename
                    },
                    {
                        where: {
                            id: userId
                        }
                    }
                )
            }

            const user = await User.findByPk(userId, {
                include: [
                    {
                        model: Address,
                        as: 'address'
                    }
                ]
            })

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    user,
                    message: 'Cập nhật thông tin thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async updatePassword(req, res, next) {
        try {
            const { id: userId } = req.user
            const { oldPassword, newPassword } = req.body

            const user = await User.findByPk(userId)
            const isMatch = bcrypt.compareSync(oldPassword, user.password)

            if (!isMatch) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        oldPassword: 'Mật khẩu cũ không chính xác'
                    }
                })
            }
            if (oldPassword === newPassword) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        newPassword: 'Mật khẩu mới phải khác mật khẩu cũ'
                    }
                })
            }

            const hashedPassword = bcrypt.hashSync(newPassword)

            user.password = hashedPassword
            await user.save()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: 'Cập nhật mật khẩu thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '')

            if (!token) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tồn tại 1'
                    }
                })
            }
            const isTokenValid = jwt.verify(token, env.SECRET_KEY)
            if (!isTokenValid) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tồn tại 2'
                    }
                })
            }

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: 'Đăng xuất tài khoản thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new UserController()

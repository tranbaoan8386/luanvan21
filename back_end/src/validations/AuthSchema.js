const Joi = require('joi')
class AuthSchema {
    get register() {
        return Joi.object({
            name: Joi.string().required().messages({
                'string.base': 'Tên phải là chuỗi',
                'string.empty': 'Tên không được để trống',
                'any.required': 'Tên là trường bắt buộc'
            }),
            email: Joi.string().email().required().messages({
                'string.base': 'Email phải là chuỗi',
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            }),
            password: Joi.string().required().messages({
                'string.base': 'Mật khẩu phải là chuỗi',
                'string.empty': 'Mật khẩu không được để trống',
                'any.required': 'Mật khẩu là trường bắt buộc'
            })
        })
    }
    get login() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.base': 'Email phải là chuỗi',
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            }),
            password: Joi.string().required().messages({
                'string.base': 'Mật khẩu phải là chuỗi',
                'string.empty': 'Mật khẩu không được để trống',
                'any.required': 'Mật khẩu là trường bắt buộc'
            })
        })
    }
    get verifyOtp() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.base': 'Email phải là chuỗi',
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            }),
            otp: Joi.string().required().messages({
                'string.base': 'Otp phải là chuỗi',
                'string.empty': 'Otp không được để trống',
                'any.required': 'Otp là trường bắt buộc'
            })
        })
    }
    get forgotPassword() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.base': 'Email phải là chuỗi',
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            })
        })
    }

    get resendOtp() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.base': 'Email phải là chuỗi',
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            })
        })
    }

    get resendForgotToken() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.base': 'Email phải là chuỗi',
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            })
        })
    }
    get verifyForgotToken() {
        return Joi.object({
            token: Joi.string().required().messages({
                'string.base': 'Token phải là chuỗi',
                'string.empty': 'Token không được để trống',
                'any.required': 'Token là trường bắt buộc'
            })
        })
    }

    get resetPassword() {
        return Joi.object({
            email: Joi.string().email().required().messages({
                'string.base': 'Email phải là chuỗi',
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            }),
            token: Joi.string().required().messages({
                'string.base': 'Token phải là chuỗi',
                'string.empty': 'Token không được để trống',
                'any.required': 'Token là trường bắt buộc'
            }),
            newPassword: Joi.string().required().messages({
                'string.base': 'Mật khẩu phải là chuỗi',
                'string.empty': 'Mật khẩu không được để trống',
                'any.required': 'Mật khẩu là trường bắt buộc'
            })
        })
    }
}

module.exports = new AuthSchema()

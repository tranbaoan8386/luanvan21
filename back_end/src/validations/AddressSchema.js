const Joi = require('joi')
class AddressSchema {
    get createAddress() {
        return Joi.object({
            street: Joi.string().required().messages({
                'string.empty': 'Tên đường không được để trống',
                'any.required': 'Tên đường là bắt buộc'
            }),
            district: Joi.string().required().messages({
                'string.empty': 'Tên huyện/quận  không được để trống',
                'any.required': 'Tên huyện/quận là đường bắt buộc'
            }),
            village: Joi.string().required().messages({

                'string.empty': 'Tên phường/xã  không được để trống',
                'any.required': 'Tên phường/xã  là trường bắt buộc'
            }),
            province: Joi.string().required().messages({

                'string.empty': 'Tên tỉnh/thành phố không được để trống',
                'any.required': 'Tên tỉnh/thành phố là trường bắt buộc'
            })
            ,
            phone: Joi.string().required().messages({

                'string.empty': 'Mật khẩu không được để trống',
                'any.required': 'Mật khẩu là trường bắt buộc'
            })

        })
    }
    get updateAddress() {
        return Joi.object({
            street: Joi.string().required().messages({
                'string.empty': 'Tên đường không được để trống',
                'any.required': 'Tên đường là bắt buộc'
            }),
            district: Joi.string().required().messages({
                'string.empty': 'Tên huyện/quận  không được để trống',
                'any.required': 'Tên huyện/quận là đường bắt buộc'
            }),
            village: Joi.string().required().messages({

                'string.empty': 'Tên phường/xã  không được để trống',
                'any.required': 'Tên phường/xã  là trường bắt buộc'
            }),
            province: Joi.string().required().messages({

                'string.empty': 'Tên tỉnh/thành phố không được để trống',
                'any.required': 'Tên tỉnh/thành phố là trường bắt buộc'
            })
            ,
            phone: Joi.string().required().messages({

                'string.empty': 'Mật khẩu không được để trống',
                'any.required': 'Mật khẩu là trường bắt buộc'
            })

        })
    }



}

module.exports = new AddressSchema()

const Joi = require('joi')
class BrandSchema {
    get createBrand() {
        return Joi.object({
            name: Joi.string().required().messages({
                'string.base': 'Tên thương hiệu phải là chuỗi',
                'string.empty': 'Tên thương hiệu không được để trống',
                'any.required': 'Tên thương hiệu trường bắt buộc'
            })
        })
    }
    get updateBrand() {
        return Joi.object({
            name: Joi.string().messages({
                'string.base': 'Tên thương hiệu phải là chuỗi',
                'string.empty': 'Tên thương hiệu không được để trống'
            })
        })
    }
}

module.exports = new BrandSchema()

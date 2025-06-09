const Joi = require('joi')
class SizeSchema {
    get createSize() {
        return Joi.object({
            name: Joi.string().required().messages({
                'string.base': 'Tên size phải là chuỗi',
                'string.empty': 'Tên size không được để trống',
                'any.required': 'Tên size trường bắt buộc'
            })
        })
    }
    get updateSize() {
        return Joi.object({
            name: Joi.string().messages({
                'string.base': 'Tên size phải là chuỗi',
                'string.empty': 'Tên size không được để trống'
            })
        })
    }
}

module.exports = new SizeSchema()

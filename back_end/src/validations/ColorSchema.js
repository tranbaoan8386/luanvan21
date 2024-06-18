const Joi = require('joi')
class ColorSchema {
    get createColor() {
        return Joi.object({
            name: Joi.string().required().messages({
                'string.base': 'Tên màu phải là chuỗi',
                'string.empty': 'Tên màu không được để trống',
                'any.required': 'Tên màu trường bắt buộc'
            })
        })
    }
    get updateColor() {
        return Joi.object({
            name: Joi.string().messages({
                'string.base': 'Tên màu phải là chuỗi',
                'string.empty': 'Tên màu không được để trống'
            })
        })
    }
}

module.exports = new ColorSchema()

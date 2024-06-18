const Joi = require('joi')
class CategorySchema {
    get createCategory() {
        return Joi.object({
            name: Joi.string().required().messages({
                'string.base': 'Tên danh mục phải là chuỗi',
                'string.empty': 'Tên danh mục không được để trống',
                'any.required': 'Tên danh mục trường bắt buộc'
            })
        })
    }
    get updateCategory() {
        return Joi.object({
            name: Joi.string().messages({
                'string.base': 'Tên danh mục phải là chuỗi',
                'string.empty': 'Tên danh mục không được để trống'
            })
        })
    }
}

module.exports = new CategorySchema()

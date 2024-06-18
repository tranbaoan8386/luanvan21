const Joi = require('joi')
class CartSchema {
    get updateCartItemTotalPrice() {
        return Joi.object({
            quantity: Joi.number().required().messages({
                'number.base': 'Số lượng phải là số nguyên',
                'string.empty': 'Số lượng không được để trống',
                'any.required': 'Số lượng trường bắt buộc'
            }),
            productId: Joi.number().required().messages({
                'number.base': 'Mã sản phẩm phải là số nguyên',
                'any.required': 'Mã sản phẩm trường bắt buộc'
            })
        })
    }
    get deleteProductInCart() {
        return Joi.object({
            productId: Joi.number().required().messages({
                'number.base': 'Mã sản phẩm phải là số nguyên',
                'any.required': 'Mã sản phẩm trường bắt buộc'
            })
        })
    }
}

module.exports = new CartSchema()

const Joi = require('joi')
class OrderSchema {
    get createOrder() {
        return Joi.object({
            email: Joi.string().messages({
                'string.base': 'Trảng thái đơn phải là chuỗi',
                'string.empty': 'Trảng thái đơn phải là trường bắt buộc'
            }),
            total: Joi.number().messages({
                'number.base': 'T DNC phải là số',
                'number.empty': 'T DNC không là trường bắt buộc'
            }),
            address: Joi.string().messages({
                'string.base': 'Địa chi đơn phải là chuỗi',
                'string.empty': 'Địa chi đơn phải là trường bắt buộc'
            }),
            phone: Joi.string().messages({
                'string.base': 'sdt đơn phải là chuỗi',
                'string.empty': 'sdt đơn phải là trường bắt buộc'
            }),
            fullname: Joi.string().messages({
                'string.base': 'Tên đơn phải là chuỗi',
                'string.empty': 'Tên đơn phải là trường bắt buộc'
            })
        })
    }


    get cancelOrderById() {
        return Joi.object({
            canceledReason: Joi.string().messages({
                'string.base': 'Lí do hủy đơn phải là chuỗi',
                'string.empty': 'Lí do hủy đơn không được để trống'
            })
        })
    }
}

module.exports = new OrderSchema()

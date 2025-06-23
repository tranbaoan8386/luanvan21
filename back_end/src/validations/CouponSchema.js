const Joi = require('joi')
class CouponSchema {
    get createCoupon() {
        return Joi.object({
            code: Joi.string().required().messages({
                'string.base': 'Mã khuyến mãi phải là chuỗi',
                'string.empty': 'Mã khuyến mãi không được để trống',
                'any.required': 'Mã khuyến mãi là trường bắt buộc'
            }),
            startDate: Joi.string().required().messages({
                'string.base': 'Ngày bắt đầu phải là chuỗi',
                'string.empty': 'Ngày bắt đầu không được để trống',
                'any.required': 'Ngày bắt đầu là trường bắt buộc'
            }),
            endDate: Joi.string().optional().messages({
                'string.base': 'Ngày kết thúc phải là chuỗi'
            }),
            price: Joi.number().required().messages({
                'number.base': 'Giá trị phải là số',
                'any.required': 'Giá trị là trường bắt buộc'
            })
        });
    }
    

    get updateCoupon() {
        return Joi.object({
          code: Joi.string().messages({
            'string.base': 'Mã khuyến mãi phải là chuỗi',
            'string.empty': 'Mã khuyến mãi không được để trống'
          }),
          price: Joi.number().messages({
            'number.base': 'Giá trị phải là số',
            'string.empty': 'Giá trị không được để trống'
          }),
          startDate: Joi.string().required().messages({
            'string.base': 'Ngày bắt đầu phải là chuỗi',
            'string.empty': 'Ngày bắt đầu không được để trống',
            'any.required': 'Ngày bắt đầu là trường bắt buộc'
          }),
          endDate: Joi.string().required().messages({
            'string.base': 'Ngày kết thúc phải là chuỗi',
            'string.empty': 'Ngày kết thúc không được để trống',
            'any.required': 'Ngày kết thúc là trường bắt buộc'
          })
        })
      }
      

    get addCouponToCart() {
        return Joi.object({
            codeCoupon: Joi.string().required().messages({
                'string.base': 'Mã khuyến mãi phải là chuỗi',
                'string.empty': 'Mã khuyến mãi không được để trống',
                'any.required': 'Mã khuyến mãi trường bắt buộc'
            })
        })
    }
    get getCoupon() {
        return Joi.object({
            code: Joi.string().required().messages({
                'string.base': 'Mã khuyến mãi phải là chuỗi',
                'string.empty': 'Mã khuyến mãi không được để trống',
                'any.required': 'Mã khuyến mãi trường bắt buộc'
            })
        })
    }
}

module.exports = new CouponSchema()

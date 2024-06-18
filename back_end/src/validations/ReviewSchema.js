const Joi = require('joi')

class ReviewSchema {
    get createReview() {
        return Joi.object({
            comment: Joi.string().required().messages({
                'string.base': 'Bình luận phải là chuỗi',
                'string.empty': 'Bình luận không được để trống',
                'any.required': 'Bình luận là trường bắt buộc'
            }),
            rating: Joi.number().required().messages({
                'number.base': 'Đánh giá phải là số',
                'any.required': 'Đánh giá là trường bắt buộc'
            }),
            productId: Joi.number().required().messages({
                'any.required': 'Mã sản phẩm là trường bắt buộc',
                'number.base': 'Mã sản phẩm phải là số'
            })
            // userId lấy user đang đăng nhập hiện tại
        })
    }

    get updateReview() {
        return Joi.object({
            comment: Joi.string().required().messages({
                'string.base': 'Bình luận phải là chuỗi',
                'string.empty': 'Bình luận không được để trống',
                'any.required': 'Bình luận là trường bắt buộc'
            }),
            rating: Joi.number().required().messages({
                'number.base': 'Đánh giá phải là số',
                'any.required': 'Đánh giá là trường bắt buộc'
            })
        })
    }

    get getProduct() {
        return Joi.object({
            productId: Joi.number().required().messages({
                'number.base': 'Mã sản phẩm phải là số nguyên',
                'any.required': 'Mã sản phẩm trường bắt buộc'
            })
        })
    }
}
module.exports = new ReviewSchema()

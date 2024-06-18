const { Sequelize } = require('sequelize')
const Coupon = require('../models/Coupon')
const ApiResponse = require('../response/ApiResponse')
const ErrorResponse = require('../response/ErrorResponse')

class CouponController {
    async getAllCoupon(req, res, next) {
        try {
            const currentDate = new Date()

            const validCoupons = await Coupon.findAll({
                where: {
                    endDate: {
                        [Sequelize.Op.gte]: currentDate // Ngày kết thúc lớn hơn hoặc bằng ngày hiện tại
                    }
                }
            })

            return new ApiResponse(res, {
                status: 200,
                data: validCoupons
            })
        } catch (err) {
            next(err)
        }
    }
    async getCoupon(req, res, next) {
        try {
            const currentDate = new Date()
            const { id: code } = req.params

            const validCoupons = await Coupon.findOne({
                where: {
                    endDate: {
                        [Sequelize.Op.gte]: currentDate // Ngày kết thúc lớn hơn hoặc bằng ngày hiện tại
                    },
                    code
                }
            })

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    coupon: validCoupons
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async createCoupon(req, res, next) {
        try {
            const { code, price, startDate } = req.body;
            let endDate = req.body.endDate;

            const existedCode = await Coupon.findOne({
                where: {
                    code
                }
            })
            if (existedCode) {
                throw new ErrorResponse(400, 'Mã khuyến mãi đã tồn tại')
            }

            if (!endDate) {
                endDate = new Date()
                endDate.setDate(endDate.getDate() + 3)
            }

            const newCoupon = await Coupon.create({
                code,
                price,
                startDate: new Date(),
                endDate
            })
            return new ApiResponse(res, {
                status: 201,
                data: newCoupon
            })
        } catch (err) {
            next(err)
        }
    }
    async updateCoupon(req, res, next) {
        try {
            const { id: couponId } = req.params
            const { code, price, startDate } = req.body;
            let endDate = req.body.endDate;
            const coupon = await Coupon.findOne({
                where: {
                    id: couponId
                }
            })

            if (!coupon) {
                throw new ErrorResponse(404, 'Không tìm thấy khuyến mãi')
            }
            // Cập nhật thông tin của phiếu giảm giá
            coupon.code = code;
            coupon.price = price;
            coupon.startDate = startDate;

            // Ngày hết hạn ngày bắt đầu xử lý sau
            await coupon.save()
            return new ApiResponse(res, {
                status: 200,
                data: coupon
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteCoupon(req, res, next) {
        try {
            const { id: couponId } = req.params
            const coupon = await Coupon.findOne({
                where: {
                    id: couponId
                }
            })

            if (!coupon) {
                throw new ErrorResponse(404, 'Không tìm thấy khuyến mãi')
            }

            await coupon.destroy()
            return new ApiResponse(res, {
                status: 200,
                data: coupon
            })
        } catch (err) {
            next(err)
        }
    }


}

module.exports = new CouponController()

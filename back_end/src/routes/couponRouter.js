const { Router } = require('express')
const CouponController = require('../controllers/CouponController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const CouponSchema = require('../validations/CouponSchema')

const couponRouter = Router()

couponRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('customer', 'admin'), CouponController.getAllCoupon)
couponRouter.get('/:id', jwtAuthMiddleware, authorizedMiddleware('customer', 'admin'), CouponController.getCoupon)
couponRouter.post(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('admin'),
    validatorMiddleware(CouponSchema.createCoupon),
    CouponController.createCoupon
)
couponRouter.patch(
    '/:id',
    jwtAuthMiddleware,
    authorizedMiddleware('admin'),
    validatorMiddleware(CouponSchema.updateCoupon),
    CouponController.updateCoupon
)

couponRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('admin'), CouponController.deleteCoupon)

module.exports = couponRouter
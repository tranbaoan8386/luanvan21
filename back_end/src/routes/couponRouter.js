const { Router } = require('express')
const CouponController = require('../controllers/CouponController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const CouponSchema = require('../validations/CouponSchema')

const couponRouter = Router()

couponRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('Customer', 'Admin'), CouponController.getAllCoupon)
couponRouter.get('/:id', jwtAuthMiddleware, authorizedMiddleware('Customer', 'Admin'), CouponController.getCoupon)
couponRouter.post(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('Admin'),
    validatorMiddleware(CouponSchema.createCoupon),
    CouponController.createCoupon
)
couponRouter.patch(
    '/:id',
    jwtAuthMiddleware,
    authorizedMiddleware('Admin'),
    validatorMiddleware(CouponSchema.updateCoupon),
    CouponController.updateCoupon
)

couponRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), CouponController.deleteCoupon)

module.exports = couponRouter
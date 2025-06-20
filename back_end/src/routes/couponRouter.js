const { Router } = require('express');
const CouponController = require('../controllers/CouponController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const CouponSchema = require('../validations/CouponSchema');

const couponRouter = Router();

// ✅ Lấy tất cả coupon (Admin/Customer)
couponRouter.get(
  '/',
  jwtAuthMiddleware,
  authorizedMiddleware('Customer', 'Admin'),
  CouponController.getAllCoupon
);

// ✅ Áp mã giảm giá theo code (FE/cart)
couponRouter.get('/check/:id', CouponController.getCoupon); // param: code

/* // ✅ Optional (nếu dùng query string: ?code=...&totalCart=...)
couponRouter.get('/check', CouponController.checkCoupon); // query */

// ✅ Lấy coupon theo ID (admin dùng)
couponRouter.get(
  '/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Customer', 'Admin'),
  CouponController.getCouponById
);

// ✅ CRUD
couponRouter.post(
  '/',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  validatorMiddleware(CouponSchema.createCoupon),
  CouponController.createCoupon
);

couponRouter.patch(
  '/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  validatorMiddleware(CouponSchema.updateCoupon),
  CouponController.updateCoupon
);

couponRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  CouponController.deleteCoupon
);

module.exports = couponRouter;

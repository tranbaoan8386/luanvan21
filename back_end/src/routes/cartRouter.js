const { Router } = require('express');
const CartController = require('../controllers/CartController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
// const validatorMiddleware = require('../middlewares/validatorMiddleware');
// const CartSchema = require('../validations/CartSchema');

const cartRouter = Router();

// Lấy giỏ hàng
cartRouter.get(
  '/',
  jwtAuthMiddleware,
  authorizedMiddleware('Customer'),
  CartController.getCart
);

// Thêm sản phẩm vào giỏ
cartRouter.post(
  '/',
  jwtAuthMiddleware,
  authorizedMiddleware('Customer'),
  CartController.addProductToCart
);

// Xoá 1 sản phẩm khỏi giỏ (theo productItemId)
cartRouter.delete(
  '/',
  jwtAuthMiddleware,
  authorizedMiddleware('Customer'),
  CartController.deleteProductFromCart 
);

// Xoá sản phẩm giỏ hàng khi đặt hàng
cartRouter.delete(
  '/carts',
  jwtAuthMiddleware,
  authorizedMiddleware('Customer'),
  CartController.deleteProductCart 
);

// Cập nhật số lượng hoặc tổng
cartRouter.patch(
  '/',
  jwtAuthMiddleware,
  authorizedMiddleware('Customer'),
  CartController.updateCartItemTotalPrice 
);

module.exports = cartRouter;

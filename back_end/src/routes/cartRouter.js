const { Router } = require('express')
const CartController = require('../controllers/CartController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const CartSchema = require('../validations/CartSchema')

const cartRouter = Router()

cartRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('Customer'), CartController.getCart)
cartRouter.post('/', jwtAuthMiddleware, authorizedMiddleware('Customer'), CartController.addProductToCart)
cartRouter.delete(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('Customer'),
    validatorMiddleware(CartSchema.deleteProductInCart),
    CartController.deleteProductFromCart
)
cartRouter.delete(
    '/carts',

    jwtAuthMiddleware, authorizedMiddleware('Customer'),
    validatorMiddleware(CartSchema.deleteProductInCart),
    CartController.deleteProductCart
)
cartRouter.patch(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('Customer'),
    validatorMiddleware(CartSchema.updateCartItemTotalPrice),
    CartController.updateCartItemTotalPrice
)
cartRouter.patch(
    '/',
    jwtAuthMiddleware, authorizedMiddleware('Customer'),

    validatorMiddleware(CartSchema.updateCartItemTotalPrice),
    CartController.updateCartItemTotalPrice
)

module.exports = cartRouter

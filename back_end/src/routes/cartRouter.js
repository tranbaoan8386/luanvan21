const { Router } = require('express')
const CartController = require('../controllers/CartController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const CartSchema = require('../validations/CartSchema')

const cartRouter = Router()

cartRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('customer'), CartController.getCart)
cartRouter.post('/', jwtAuthMiddleware, authorizedMiddleware('customer'), CartController.addProductToCart)
cartRouter.delete(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('customer'),
    validatorMiddleware(CartSchema.deleteProductInCart),
    CartController.deleteProductFromCart
)
cartRouter.delete(
    '/carts',

    jwtAuthMiddleware, authorizedMiddleware('customer'),
    validatorMiddleware(CartSchema.deleteProductInCart),
    CartController.deleteProductCart
)
cartRouter.patch(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('customer'),
    validatorMiddleware(CartSchema.updateCartItemTotalPrice),
    CartController.updateCartItemTotalPrice
)

module.exports = cartRouter

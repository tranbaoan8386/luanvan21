const { Router } = require('express')
const OrderController = require('../controllers/OrderController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const OrderSchema = require('../validations/OrderSchema')
const orderRouter = Router()

orderRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('customer', 'admin'), OrderController.getAllOrder)
orderRouter.get('/:id', jwtAuthMiddleware, authorizedMiddleware('customer', 'admin'), OrderController.getOrderById)
orderRouter.post(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('customer'),
    // validatorMiddleware(OrderSchema.createOrder),
    OrderController.createOrder
)
orderRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('admin'), OrderController.deleteOrder)
orderRouter.patch(
    '/cancel/:id',
    jwtAuthMiddleware,
    authorizedMiddleware('owner', 'customer'),
    validatorMiddleware(OrderSchema.cancelOrderById),
    OrderController.cancelOrderById
)
orderRouter.patch('/shipper/:id', jwtAuthMiddleware, authorizedMiddleware('owner'), OrderController.setShipperOrder)
orderRouter.patch('/delivered/:id', jwtAuthMiddleware, authorizedMiddleware('owner'), OrderController.setDeliveredOrder)

module.exports = orderRouter

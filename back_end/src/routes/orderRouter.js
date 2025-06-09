const { Router } = require('express')
const OrderController = require('../controllers/OrderController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const OrderSchema = require('../validations/OrderSchema')
const orderRouter = Router()
orderRouter.get('/statistics', 
    jwtAuthMiddleware, 
    authorizedMiddleware('Admin'), 
    OrderController.getStatistics
);
orderRouter.get('/sale',
    OrderController.getSale)
orderRouter.get('/salemonth',
    OrderController.getMonthlyRevenue)
orderRouter.get('/saleannual',
    OrderController.getAnnualRevenue)
orderRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('Customer', 'Admin'), OrderController.getAllOrder)
orderRouter.get('/:id', jwtAuthMiddleware, authorizedMiddleware('Customer', 'Admin'), OrderController.getOrderById)
orderRouter.post(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('Customer'),
    // validatorMiddleware(OrderSchema.createOrder),
    OrderController.createOrder
)
orderRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.deleteOrder)
orderRouter.patch(
    '/cancel/:id',

    OrderController.cancelOrderById
)
orderRouter.patch('/shipper/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setShipperOrder)
orderRouter.patch('/cancelled/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setCancelledOrder)
orderRouter.patch('/delivered/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setDeliveredOrder)
orderRouter.patch('/payment/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setPaymentOrder)
module.exports = orderRouter

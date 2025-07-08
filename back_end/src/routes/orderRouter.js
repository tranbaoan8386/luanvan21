const { Router } = require('express');
const OrderController = require('../controllers/OrderController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const OrderSchema = require('../validations/OrderSchema');

const orderRouter = Router();

// Thống kê, doanh thu
orderRouter.get('/statistics', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.getStatistics);
orderRouter.get('/sale', OrderController.getSale);
orderRouter.get('/salemonth', OrderController.getMonthlyRevenue);
orderRouter.get('/saleannual', OrderController.getAnnualRevenue);

// Danh sách, chi tiết đơn
orderRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('Customer', 'Admin'), OrderController.getAllOrder);
orderRouter.get('/:id', jwtAuthMiddleware, authorizedMiddleware('Customer', 'Admin'), OrderController.getOrderById);

// Tạo đơn
orderRouter.post(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('Customer'),
    // validatorMiddleware(OrderSchema.createOrder),
    OrderController.createOrder
);

// Xóa đơn (Admin)
orderRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.deleteOrder);

// ✅ SỬA TẠI ĐÂY: Huỷ đơn hàng (Customer)
orderRouter.patch(
    '/cancel/:id',
    jwtAuthMiddleware,                    // Thêm dòng này
    authorizedMiddleware('Customer'),    // Thêm dòng này
    OrderController.cancelOrderById
);

// Các cập nhật trạng thái đơn (Admin)
orderRouter.patch('/shipper/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setShipperOrder);
orderRouter.patch('/cancelled/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setCancelledOrder);
orderRouter.patch('/delivered/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setDeliveredOrder);
orderRouter.patch('/payment/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), OrderController.setPaymentOrder);

module.exports = orderRouter;

const ProductItem = require('../models/ProductItem')
const Order = require('../models/Order')
const { Sequelize } = require('sequelize');
const ApiResponse = require('../response/ApiResponse')
const OrderItem = require('../models/OrderItem')
const ErrorResponse = require('../response/ErrorResponse')
const User = require('../models/User')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
class OrderController {
    async getAllOrder(req, res, next) {
        try {
            let orders = await Order.findAll({
                include: [
                    {
                        model: ProductItem,
                        as: 'productitems'
                    },
                    {
                        model: User, // Tham chiếu đến mô hình User
                        attributes: ['id', 'name', 'email'], // Chọn các trường của User bạn muốn include
                        as: 'users' // Đặt tên alias cho User trong kết quả trả về
                    }
                ]
            });

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    orders
                }
            });
        } catch (error) {
            next(error);
        }
    }


    async getOrderById(req, res, next) {
        try {
            const { id: userId, role } = req.user;
            const { id: orderId } = req.params;

            let order = [];
            if (role === 'customer') {
                order = await Order.findOne({
                    where: {
                        id: orderId,
                        userId
                    },
                    include: [{
                        model: OrderItem,
                        as: 'items',
                        include: [{
                            model: ProductItem,
                            as: 'productItem',
                            include: [{
                                model: Product,
                                as: 'product',
                                attributes: ['name', 'price']
                            }]
                        }]
                    }]
                });
            }

            if (role === 'owner') {
                order = await Order.findOne({
                    where: {
                        id: orderId
                    },
                    include: [{
                        model: OrderItem,
                        as: 'items',
                        include: [{
                            model: ProductItem,
                            as: 'productItem',
                            include: [{
                                model: Product,
                                as: 'product',
                                attributes: ['name'] // Chỉ bao gồm thuộc tính name của Product
                            }]
                        }]
                    }]
                });
            }

            if (!order) {
                throw new ErrorResponse(404, 'Không tìm thấy đơn hàng');
            }

            return new ApiResponse(res, {
                status: 200,
                data: order
            });
        } catch (error) {
            next(error);
        }
    }





    async getSale(req, res) {
        try {
            const dailyRevenue = await Order.findAll({
                attributes: [
                    [Sequelize.fn('DATE', Sequelize.col('createDate')), 'date'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'totalRevenue']
                ],
                group: [Sequelize.fn('DATE', Sequelize.col('createDate'))],
                order: [[Sequelize.fn('DATE', Sequelize.col('createDate')), 'ASC']]
            });
            res.json({ success: true, data: dailyRevenue });
        } catch (error) {
            console.error('Error fetching daily revenue data:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    async getMonthlyRevenue(req, res) {
        try {
            const monthlyRevenue = await Order.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createDate'), '%Y-%m'), 'month'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'totalRevenue']
                ],
                group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createDate'), '%Y-%m')],
                order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createDate'), '%Y-%m'), 'ASC']]
            });
            res.json({ success: true, data: monthlyRevenue });
        } catch (error) {
            console.error('Error fetching monthly revenue data:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }
    async getAnnualRevenue(req, res) {
        try {
            const annualRevenue = await Order.findAll({
                attributes: [
                    [Sequelize.fn('YEAR', Sequelize.col('createDate')), 'year'],
                    [Sequelize.fn('SUM', Sequelize.col('total')), 'totalRevenue']
                ],
                group: [Sequelize.fn('YEAR', Sequelize.col('createDate'))],
                order: [[Sequelize.fn('YEAR', Sequelize.col('createDate')), 'ASC']]
            });
            res.json({ success: true, data: annualRevenue });
        } catch (error) {
            console.error('Error fetching annual revenue data:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    }


    async createOrder(req, res, next) {
        try {
            const { id: userId } = req.user;
            const {
                total,
                phone,
                email,
                fullname,
                address,
                paymentMethod,
                orders_tem,
                note
            } = req.body;

            // Create the order
            const order = await Order.create({
                total,
                phone,
                email,
                fullname,
                address,
                userId,
                status: 'pending',
                statusPayment: paymentMethod === 'cash' ? 'Chưa thanh toán' : 'Đã thanh toán',
                note
            });

            const createdOrderItems = [];

            for (const item of orders_tem) {
                const { productItemId, quantity } = item;

                // Create OrderItem
                const orderItem = await OrderItem.create({
                    orderId: order.id,
                    productItemId,
                    quantity
                });
                createdOrderItems.push(orderItem);

                // Update the product item stock
                const productItem = await ProductItem.findByPk(productItemId);
                if (productItem) {
                    const newStock = productItem.unitlnStock - quantity;
                    if (newStock < 0) {
                        throw new Error(`Không đủ tồn kho cho sản phẩm ${productItemId}`);
                    }
                    await productItem.update({ unitlnStock: newStock });

                    // Update the product's sold quantity
                    const product = await Product.findByPk(productItem.productId);
                    if (product) {
                        await product.update({
                            sold: product.sold + quantity
                        });
                    }
                } else {
                    throw new Error(`Không tìm thấy sản phẩm với ID: ${productItemId}`);
                }
            }

            const info_order = {
                ...order.dataValues,
                orders_tem: createdOrderItems
            };

            return res.status(200).json({
                success: true,
                data: {
                    info_order,
                    message: 'Đặt hàng thành công'
                }
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
    }





    async deleteOrder(req, res, next) {
        try {
            const { id: orderId } = req.params

            const order = await Order.destroy({
                where: {
                    id: orderId
                }
            })
            if (!order) {
                throw new ErrorResponse(404, 'Không tìm thấy đơn hàng')
            }

            return new ApiResponse(res, {
                status: 200,
                message: 'Xóa đơn hàng thành công'
            })
        } catch (err) {
            next(err)
        }
    }

    async cancelOrderById(req, res, next) {
        try {
            const { id: userId, role } = req.user;
            const { id: orderId } = req.params;


            // Tìm đơn hàng theo ID
            const order = await Order.findOne({
                where: {
                    id: orderId
                }
            });

            // Kiểm tra xem đơn hàng có tồn tại không
            if (!order) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy đơn hàng'
                    }
                });
            }

            // Kiểm tra quyền của người dùng
            if (role === 'customer' && userId !== order.userId) {
                return ApiResponse.error(res, {
                    status: 403,
                    data: {
                        message: 'Bạn không có quyền hủy đơn hàng của người khác'
                    }
                });
            }

            // Cập nhật trạng thái đơn hàng
            order.status = 'cancelled';
            await order.save();

            // Trả về phản hồi thành công
            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: 'Cập nhật đơn hàng thành công'
                }
            });
        } catch (err) {
            next(err);
        }
    }


    async setShipperOrder(req, res, next) {
        try {
            const { id: orderId } = req.params;

            // Find the order by ID
            const order = await Order.findOne({
                where: {
                    id: orderId
                }
            });

            // If order is not found, throw an error
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Không tìm thấy đơn hàng'
                });
            }

            // Update the order status to 'shipped'
            order.status = 'shipped';
            await order.save();

            // Return success response
            return res.status(200).json({
                success: true,
                data: {
                    message: 'Cập nhật đơn hàng thành công'
                }
            });
        } catch (error) {
            // Catch any unexpected errors and pass them to the next middleware
            next(error);
        }
    }

    async setDeliveredOrder(req, res, next) {
        try {
            const { id: orderId } = req.params;




            // Find the order by ID
            const order = await Order.findOne({
                where: {
                    id: orderId
                }
            });

            // If order is not found, return 404
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Không tìm thấy đơn hàng'
                });
            }

            // Update the order status to 'delivered'
            order.status = 'delivered';
            await order.save();

            // Return success response
            return res.status(200).json({
                success: true,
                data: {
                    message: 'Cập nhật đơn hàng thành công'
                }
            });
        } catch (error) {
            console.error('Error updating order status:', error); // Log the error details
            return res.status(500).json({
                success: false,
                message: 'Internal Error.',
                error: error.message
            });
        }
    }
    async setCancelledOrder(req, res, next) {
        try {
            const { id: orderId } = req.params;
            // Find the order by ID
            const order = await Order.findOne({
                where: {
                    id: orderId
                }
            });

            // If order is not found, return 404
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Không tìm thấy đơn hàng'
                });
            }

            // Update the order status to 'delivered'
            order.status = 'cancelled';
            await order.save();

            // Return success response
            return res.status(200).json({
                success: true,
                data: {
                    message: 'Cập nhật đơn hàng thành công'
                }
            });
        } catch (error) {
            console.error('Error updating order status:', error); // Log the error details
            return res.status(500).json({
                success: false,
                message: 'Internal Error.',
                error: error.message
            });
        }
    }


    async setPaymentOrder(req, res, next) {
        try {
            const { id: orderId } = req.params;
            // Find the order by ID
            const order = await Order.findOne({
                where: {
                    id: orderId
                }
            });

            // If order is not found, return 404
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'Không tìm thấy đơn hàng'
                });
            }
            order.statusPayment = 'paid';
            await order.save();

            // Return success response
            return res.status(200).json({
                success: true,
                data: {
                    message: 'Cập nhật đơn hàng thành công'
                }
            });
        } catch (error) {
            console.error('Error updating order status:', error); // Log the error details
            return res.status(500).json({
                success: false,
                message: 'Internal Error.',
                error: error.message
            });
        }
    }
}



module.exports = new OrderController()

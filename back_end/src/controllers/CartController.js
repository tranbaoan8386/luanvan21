const Cart = require('../models/Cart')
const CartItem = require('../models/CartItem')
const Product = require('../models/Product')
const Color = require('../models/Color')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const ProductItem = require('../models/ProductItem')
const sequelize = require('../database/connectMysql')
const Coupon = require('../models/Coupon')
const Size = require('../models/Size')
class CartController {
    async getCart(req, res, next) {
        try {
            const { id: userId } = req.user;
            const cart = await Cart.findOne({
                where: {
                    userId,
                    isPaid: false
                }
            });

            if (!cart) {
                return ApiResponse.success(res, {
                    status: 200,
                    data: []
                });
            }

            const cartItems = await CartItem.findAll({
                where: {
                    cartId: cart.id
                },
                include: [

                    {
                        model: ProductItem,
                        as: 'productItem',
                        attributes: ['id', 'colorId', 'productId', 'unitInStock', 'sizeId'],
                        include: [
                            {
                                model: Product,
                                as: 'product',
                                attributes: ['id', 'name', 'price', 'productCouponId', 'image'],
                                include: [
                                    {
                                        model: Coupon,
                                        as: 'productCoupon'

                                    }
                                ]
                            },
                            {
                                model: Color,
                                as: 'colorInfo',
                                attributes: ['id', 'colorCode']
                            },
                            {
                                model: Size,
                                as: 'sizeInfo',
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ]
            });

            return ApiResponse.success(res, {
                status: 200,
                data: cartItems
            });
        } catch (error) {
            next(error);
        }
    }
    async addProductToCart(req, res, next) {
        try {
            const { ProductItemId, quantity, colorId, sizeId } = req.body;
            const { id: userId } = req.user;

            // Kiểm tra dữ liệu đầu vào
            if (!ProductItemId || !quantity || !colorId || !sizeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin sản phẩm hoặc số lượng.'
                });
            }

            // Tìm giỏ hàng của người dùng (chưa thanh toán)
            let cart = await Cart.findOne({
                where: { userId, isPaid: false }
            });

            // Nếu giỏ hàng chưa tồn tại, tạo mới
            if (!cart) {
                cart = await Cart.create({ userId, isPaid: false, total: 0 });
            }

            // Tìm ProductItem với colorId và sizeId tương ứng
            const productItem = await ProductItem.findOne({
                where: { 
                    productId: (await ProductItem.findOne({ where: { id: ProductItemId } })).productId,
                    colorId: colorId,
                    sizeId: sizeId
                },
                include: [
                    {
                        model: Product,
                        as: 'product'
                    }
                ]
            });

            if (!productItem) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm với màu và size đã chọn.'
                });
            }

            // Kiểm tra tồn kho
            if (productItem.unitInStock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Số lượng sản phẩm vượt quá tồn kho. Tồn kho hiện tại: ${productItem.unitInStock}`
                });
            }

            // Tìm CartItem với ProductItemId, colorId và sizeId tương ứng
            const cartItem = await CartItem.findOne({
                where: { 
                    cartId: cart.id, 
                    ProductItemId: productItem.id,
                    colorId,
                    sizeId
                }
            });

            let updatedCartItem;
            if (cartItem) {
                // Cập nhật số lượng và tổng giá trị
                const newQuantity = cartItem.quantity + quantity;
                if (newQuantity > productItem.unitInStock) {
                    return res.status(400).json({
                        success: false,
                        message: `Số lượng sản phẩm vượt quá tồn kho.`
                    });
                }
                const newTotal = newQuantity * (productItem.product.promotionPrice || productItem.product.price);
                await cartItem.update({ quantity: newQuantity, total: newTotal });
                updatedCartItem = cartItem;
            } else {
                // Tạo mới CartItem
                const itemTotal = quantity * (productItem.product.promotionPrice || productItem.product.price);
                updatedCartItem = await CartItem.create({
                    cartId: cart.id,
                    ProductItemId: productItem.id,
                    quantity,
                    colorId,
                    sizeId,
                    total: itemTotal
                });
            }

            // Cập nhật tổng giá trị giỏ hàng
            const updatedCartTotal = await CartItem.sum('total', {
                where: { cartId: cart.id }
            });
            await cart.update({ total: updatedCartTotal });

            // Trả về phản hồi
            res.status(201).json({
                success: true,
                message: 'Thêm sản phẩm vào giỏ hàng thành công.',
                data: {
                    cartItem: updatedCartItem,
                    cartTotal: updatedCartTotal
                }
            });
        } catch (error) {
            console.error('Error in addProductToCart:', error);
            next(error);
        }
    }
    

    async deleteProductFromCart(req, res, next) {
        try {
            const { productItemId } = req.body;
            const { id: userId } = req.user;

            // Tìm giỏ hàng
            const cart = await Cart.findOne({
                where: {
                    userId,
                    isPaid: false
                }
            });

            if (!cart) {
                console.log('Không tìm thấy giỏ hàng');
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy giỏ hàng'
                });
            }

            console.log('cartId:', cart.id);

            const productInCart = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    productItemId: productItemId
                }
            });

            if (!productInCart) {
                console.log('Không tìm thấy sản phẩm trong giỏ hàng');
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm trong giỏ hàng'
                });
            }

            await productInCart.destroy();

            return res.status(200).json({
                success: true,
                data: {
                    productInCart,
                    message: 'Xóa sản phẩm thành công'
                }
            });
        } catch (err) {
            next(err);
        }
    }

    async updateCartItemTotalPrice(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { quantity, productItemId } = req.body;

            // Find the cart
            const cart = await Cart.findOne({
                where: {
                    userId,
                    isPaid: false
                }
            });

            if (!cart) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy giỏ hàng'
                    }
                });
            }

            // Find ProductItem to check existence
            const productItem = await ProductItem.findOne({
                where: {
                    id: productItemId
                }
            });

            if (!productItem) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy ProductItem'
                    }
                });
            }

            const product = await Product.findOne({
                where: {
                    id: productItem.productId
                }
            });

            if (!product) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy sản phẩm'
                    }
                });
            }

            // Find the item in the cart
            let productInCart = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    productItemId: productItem.id
                }
            });

            if (productInCart) {
                // Update the quantity and total price of the item in the cart
                const newTotal = quantity * (product.promotionPrice || product.price);
                await productInCart.update({
                    quantity,
                    total: newTotal
                });
            } else {
                // If the item is not already in the cart, add it
                const itemTotal = quantity * (product.promotionPrice || product.price);
                productInCart = await CartItem.create({
                    cartId: cart.id,
                    productItemId: productItem.id,
                    quantity,
                    total: itemTotal
                });
            }

            // Calculate the total price of the cart
            const allProductInCart = await CartItem.findAll({
                where: {
                    cartId: cart.id
                }
            });

            const totalInCart = allProductInCart.reduce((accumulator, item) => {
                return accumulator + item.total;
            }, 0);

            await cart.update({
                total: totalInCart
            });

            return ApiResponse.success(res, {
                status: 200,
                data: productInCart
            });
        } catch (err) {
            console.error("Error in updateCartItemTotalPrice:", err);
            next(err);
        }
    }
    async deleteProductCart(req, res, next) {
        try {
            const { productItemId } = req.body;
            const { id: userId } = req.user;

            // Tìm giỏ hàng
            const cart = await Cart.findOne({
                where: {
                    userId,
                    isPaid: false
                }
            });

            if (!cart) {
                console.log('Không tìm thấy giỏ hàng');
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy giỏ hàng'
                });
            }

            console.log('cartId:', cart.id);

            const productInCart = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    productItemId: productItemId
                }
            });

            if (!productInCart) {
                console.log('Không tìm thấy sản phẩm trong giỏ hàng');
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm trong giỏ hàng'
                });
            }

            await productInCart.destroy();

            return res.status(200).json({
                success: true,
                data: {
                    productInCart
                }
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CartController()

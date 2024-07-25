const Cart = require('../models/Cart')
const CartItem = require('../models/CartItem')
const Product = require('../models/Product')
const Color = require('../models/Color')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const ProductItem = require('../models/ProductItem')
const sequelize = require('../database/connectMysql')
const Coupon = require('../models/Coupon')
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
                        attributes: ['id', 'colorId', 'productId', 'unitlnStock'],
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
            const { ProductItemId, quantity, colorId } = req.body;

            const { id: userId } = req.user;
            console.log("req.user", req.user)
            if (!ProductItemId || !quantity) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        message: 'Thiếu thông tin sản phẩm hoặc số lượng'
                    }
                });
            }

            let cart = await Cart.findOne({
                where: {
                    userId,
                    isPaid: false
                }
            });

            if (!cart) {
                cart = await Cart.create({
                    userId,
                    isPaid: false,
                    total: 0
                });
            }

            const productItem = await ProductItem.findOne({
                where: {
                    id: ProductItemId
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
            if (productItem.unitlnStock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Số lượng sản phẩm vượt quá số lượng tồn kho. Tồn kho hiện tại: ${productItem.unitlnStock}`
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

            const cartItem = await CartItem.findOne({
                where: {
                    cartId: cart.id,
                    ProductItemId: productItem.id
                }
            });

            if (cartItem) {
                const newQuantity = cartItem.quantity + quantity;
                const newTotal = newQuantity * (product.promotionPrice || product.price);
                await cartItem.update({
                    quantity: newQuantity,
                    total: newTotal
                });

                const updatedCartTotal = await CartItem.sum('total', { where: { cartId: cart.id } });

                await cart.update({
                    total: updatedCartTotal
                });

                return ApiResponse.success(res, {
                    status: 200,
                    data: {
                        message: 'Số lượng sản phẩm đã được cập nhật',
                        cartItem
                    }
                });
            } else {
                const itemTotal = quantity * (product.promotionPrice || product.price);
                const newCartItem = await CartItem.create({
                    cartId: cart.id,
                    ProductItemId: productItem.id,
                    quantity,
                    colorId: colorId,
                    total: itemTotal
                });

                const updatedCartTotal = await CartItem.sum('total', { where: { cartId: cart.id } });

                await cart.update({
                    total: updatedCartTotal
                });

                return ApiResponse.success(res, {
                    status: 201,
                    data: {
                        message: 'Thêm vào giỏ hàng thành công',
                        cartItem: newCartItem
                    }
                });
            }
        } catch (error) {
            console.error("Error in addProductToCart:", error);
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

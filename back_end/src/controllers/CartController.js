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
            const { id: users_id } = req.user;
            const cart = await Cart.findOne({
                where: {
                    users_id,
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
    carts_id: cart.id
  },
  include: [
    {
      model: ProductItem,
      as: 'productItem',
      
attributes: ['id', 'color_id', 'products_id', 'unitInStock', 'size_id', 'price'],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Color,
          as: 'color', // ✅ sửa lại từ 'colorInfo' → 'color'
          attributes: ['id', 'colorCode']
        },
        {
          model: Size,
          as: 'size', // ✅ sửa lại từ 'sizeInfo' → 'size'
          attributes: ['id', 'name']
        }
      ]
    }
  ]
})




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
        const { products_item_id, quantity, color_id, size_id } = req.body;
        const { id: users_id } = req.user;

        if (!products_item_id || !quantity || !color_id || !size_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin sản phẩm hoặc số lượng.'
            });
        }

        let cart = await Cart.findOne({ where: { users_id, isPaid: false } });
        if (!cart) {
            cart = await Cart.create({ users_id, isPaid: false });
        }

        const originalItem = await ProductItem.findOne({ where: { id: products_item_id } });
        if (!originalItem) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm gốc.' });
        }

        const productItem = await ProductItem.findOne({
            where: {
                products_id: originalItem.products_id,
                color_id,
                size_id
            },
            include: [{ model: Product, as: 'product' }]
        });

        if (!productItem) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm với màu và size đã chọn.' });
        }

        if (productItem.unitInStock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Số lượng sản phẩm vượt quá tồn kho. Tồn kho hiện tại: ${productItem.unitInStock}`
            });
        }

        let updatedCartItem;
        const cartItem = await CartItem.findOne({
            where: {
                carts_id: cart.id,
                products_item_id: productItem.id
            }
        });

        if (cartItem) {
            const newQuantity = cartItem.quantity + quantity;
            await cartItem.update({ quantity: newQuantity });
            updatedCartItem = cartItem;
        } else {
            updatedCartItem = await CartItem.create({
                carts_id: cart.id,
                products_item_id: productItem.id,
                quantity
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Thêm sản phẩm vào giỏ hàng thành công.',
            data: {
                cartItem: updatedCartItem,
                cartTotal: null // hoặc bỏ luôn nếu không cần
            }
        });
    } catch (error) {
        console.error('Error in addProductToCart:', error);
        next(error);
    }
}

    

   async deleteProductFromCart(req, res, next) {
  try {
    console.log('📦 [deleteProductFromCart] req.body =', req.body);

    const products_item_id = req.body.productItemId || req.body.products_item_id;
    console.log('➡️  products_item_id =', products_item_id);

    const { id: users_id } = req.user;

    const cart = await Cart.findOne({
      where: { users_id, isPaid: false }
    });

    if (!cart) {
      console.log('❌ Không tìm thấy giỏ hàng');
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    console.log('carts_id:', cart.id);

    const productInCart = await CartItem.findOne({
      where: {
        carts_id: cart.id,
        products_item_id: products_item_id
      }
    });

    if (!productInCart) {
      console.warn('⚠️ Sản phẩm không còn trong giỏ, bỏ qua...');
      return res.status(200).json({
        success: true,
        message: 'Sản phẩm đã được xoá hoặc không tồn tại, bỏ qua.'
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
    console.error('❌ Lỗi server khi xoá sản phẩm:', err);
    next(err);
  }
}



    async updateCartItemTotalPrice(req, res, next) {
        try {
            const { id: users_id } = req.user;
            const { quantity, products_item_id } = req.body;

            // Find the cart
            const cart = await Cart.findOne({
                where: {
                    users_id,
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
                    id: products_item_id
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
                    carts_id: cart.id,
                    products_item_id: productItem.id
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
                    carts_id: cart.id,
                    products_item_id: productItem.id,
                    quantity,
                    // total: itemTotal
                });
            }

            // Calculate the total price of the cart
            const allProductInCart = await CartItem.findAll({
                where: {
                    carts_id: cart.id
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
    console.log('📦 [deleteProductCart] req.body =', req.body);

    const productItemId = req.body.productItemId || req.body.products_item_id;
    const { id: users_id } = req.user;

    if (!productItemId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu productItemId trong yêu cầu xoá sản phẩm'
      });
    }

    // ...


    const cart = await Cart.findOne({
      where: { users_id, isPaid: false }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    const productInCart = await CartItem.findOne({
      where: {
        carts_id: cart.id,
        products_item_id: productItemId
      }
    });

    if (!productInCart) {
  console.warn('⚠️ Sản phẩm không còn trong giỏ, bỏ qua...');
  return res.status(200).json({
    success: true,
    message: 'Sản phẩm đã được xoá hoặc không tồn tại, bỏ qua.'
  });
}


    await productInCart.destroy();

    return res.status(200).json({
      success: true,
      data: { productInCart }
    });
  } catch (err) {
    console.error('❌ Lỗi server khi xoá sản phẩm:', err);
    next(err);
  }
}


}
module.exports = new CartController();

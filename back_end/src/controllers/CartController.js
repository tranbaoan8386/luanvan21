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
          attributes: ['id', 'quantity', 'price'],
          include: [
            {
              model: ProductItem,
              as: 'productItem',
              attributes: ['id', 'price'],
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['id', 'name', 'avatar']
                },
                {
                  model: Color,
                  as: 'color',
                  attributes: ['id', 'colorCode']
                },
                {
                  model: Size,
                  as: 'size',
                  attributes: ['id', 'name']
                },
                {
                  model: Coupon,
                  as: 'coupon',
                  attributes: ['id', 'code', 'price']
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
    const { products_item_id, quantity, color_id, size_id } = req.body;
    const { id: users_id } = req.user;

    console.log('➡️ Dữ liệu nhận:', { products_item_id, quantity, color_id, size_id, users_id });

    if (!products_item_id || !quantity || !color_id || !size_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin sản phẩm hoặc số lượng.'
      });
    }

    // 🔍 Tìm hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ where: { users_id, isPaid: false } });
    if (!cart) {
      cart = await Cart.create({ users_id, isPaid: false });
      console.log('🛒 Tạo giỏ hàng mới:', cart.id);
    } else {
      console.log('🛒 Đã có giỏ hàng:', cart.id);
    }

    // 📦 Tìm sản phẩm gốc
    const originalItem = await ProductItem.findOne({ where: { id: products_item_id } });
    if (!originalItem) {
      console.log('❌ Không tìm thấy sản phẩm gốc:', products_item_id);
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm gốc.' });
    }

    console.log('📦 Sản phẩm gốc:', originalItem);

    // 🎯 Tìm đúng sản phẩm theo products_id + color_id + size_id
    const productItem = await ProductItem.findOne({
      where: {
        products_id: originalItem.products_id,
        color_id,
        size_id
      },
      include: [
        { model: Product, as: 'product' },
        { model: Coupon, as: 'coupon', attributes: ['id', 'price'] }
      ]
    });

    if (!productItem) {
      console.log('❌ Không tìm thấy productItem theo màu/size:', { products_id: originalItem.products_id, color_id, size_id });
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm với màu và size đã chọn.' });
    }

    console.log('✅ Sản phẩm chọn:', productItem);
    console.log('💰 Giá gốc:', productItem.price);
    console.log('🏷️ Giá giảm (coupon):', productItem.coupon?.price || 0);

    // ⛔ Chặn giảm giá 2 lần nếu sản phẩm đã có mã giảm sẵn
    // ⚠️ Chỉ chặn nếu có coupon đang áp từ client + sản phẩm đã giảm giá
    if (req.body.couponCode && productItem.coupons_id) {
      console.log('⛔ Sản phẩm đã có khuyến mãi sẵn, không thể áp thêm mã.');
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm đã được giảm giá sẵn, không thể áp thêm mã khuyến mãi.'
      });
    }


    if (productItem.unitInStock < quantity) {
      console.log('⚠️ Số lượng vượt tồn kho:', productItem.unitInStock);
      return res.status(400).json({
        success: false,
        message: `Số lượng sản phẩm vượt quá tồn kho. Tồn kho hiện tại: ${productItem.unitInStock}`
      });
    }

    // ✅ Tính giá cuối cùng: GIÁ GỐC - GIÁ GIẢM
    const originalPrice = productItem.price;
    const discountAmount = productItem.coupon?.price || 0;
    const finalPrice = originalPrice - discountAmount;

    console.log('✅ Giá cuối cùng tính toán:', finalPrice);

    // 🔄 Kiểm tra item đã có trong giỏ chưa
    let cartItem = await CartItem.findOne({
      where: {
        carts_id: cart.id,
        products_item_id: productItem.id
      }
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      await cartItem.update({ quantity: newQuantity, price: finalPrice });
      console.log('📝 Cập nhật CartItem:', { id: cartItem.id, quantity: newQuantity, price: finalPrice });
    } else {
      cartItem = await CartItem.create({
        carts_id: cart.id,
        products_item_id: productItem.id,
        quantity,
        price: finalPrice
      });
      console.log('➕ Tạo mới CartItem:', cartItem);
    }

    return res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm vào giỏ hàng thành công.',
      data: {
        cartItem
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
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
            // message: 'Sản phẩm đã được xoá hoặc không tồn tại, bỏ qua.'
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
          const { quantity, productItemId } = req.body;
          console.log("📥 Body:", req.body);
  
          // Kiểm tra input hợp lệ
          if (!productItemId || typeof quantity !== 'number' || quantity <= 0) {
              return ApiResponse.error(res, {
                  status: 400,
                  data: { message: 'Thiếu hoặc sai dữ liệu: productItemId hoặc quantity' }
              });
          }
  
          // Tìm giỏ hàng chưa thanh toán
          const cart = await Cart.findOne({
              where: {
                  users_id,
                  isPaid: false
              }
          });
  
          if (!cart) {
              return ApiResponse.error(res, {
                  status: 404,
                  data: { message: 'Không tìm thấy giỏ hàng' }
              });
          }
  
          // Tìm ProductItem
          const productItem = await ProductItem.findOne({
              where: { id: productItemId }
          });
  
          if (!productItem) {
              return ApiResponse.error(res, {
                  status: 404,
                  data: { message: 'Không tìm thấy ProductItem' }
              });
          }
  
          // Tìm Product
          const product = await Product.findOne({
              where: { id: productItem.products_id }
          });
  
          if (!product) {
              return ApiResponse.error(res, {
                  status: 404,
                  data: { message: 'Không tìm thấy sản phẩm' }
              });
          }
  
          const price = product.promotionPrice || product.price;
          const newTotal = quantity * price;
  
          // Cập nhật hoặc thêm mới item trong giỏ
          let productInCart = await CartItem.findOne({
              where: {
                  carts_id: cart.id,
                  products_item_id: productItem.id
              }
          });
  
          if (productInCart) {
              await productInCart.update({
                  quantity,
                  total: newTotal
              });
          } else {
              productInCart = await CartItem.create({
                  carts_id: cart.id,
                  products_item_id: productItem.id,
                  quantity,
                  total: newTotal
              });
          }
  
          // Tính lại tổng giá trị giỏ
          const allProductInCart = await CartItem.findAll({
              where: { carts_id: cart.id }
          });
  
          const totalInCart = allProductInCart.reduce((sum, item) => sum + (item.total || 0), 0);
  
          await cart.update({ total: totalInCart });
  
          return ApiResponse.success(res, {
              status: 200,
              data: productInCart
          });
  
      } catch (err) {
          console.error("❌ Error in updateCartItemTotalPrice:", err);
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

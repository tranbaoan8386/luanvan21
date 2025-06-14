const Product = require('./Product');
const ProductItem = require('./ProductItem');
const ProductImage = require('./ProductImages');
const Category = require('./Category');
const Brand = require('./Brand');
const Material = require('./Material');
const Color = require('./Color');
const Size = require('./Size');
const Coupon = require('./Coupon');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Review = require('./Review');
const Role = require('./Role');
const Address = require('./Address');

// ===== CATEGORY - PRODUCT =====
Category.hasMany(Product, { foreignKey: 'categories_id' });
Product.belongsTo(Category, { foreignKey: 'categories_id', as: 'category' });

// ===== BRAND - PRODUCT =====
Brand.hasMany(Product, { foreignKey: 'brands_id' });
Product.belongsTo(Brand, { foreignKey: 'brands_id', as: 'brand' });


// ===== PRODUCT - PRODUCT ITEM =====
Product.hasMany(ProductItem, { foreignKey: 'products_id', as: 'productItems' });
ProductItem.belongsTo(Product, { foreignKey: 'products_id', as: 'product' });

// ===== PRODUCT ITEM - PRODUCT IMAGE =====
ProductItem.hasMany(ProductImage, { foreignKey: 'products_item_id', as: 'images' });
ProductImage.belongsTo(ProductItem, { foreignKey: 'products_item_id', as: 'productItem' });

// ===== PRODUCT ITEM - COLOR =====
Color.hasMany(ProductItem, { foreignKey: 'color_id', as: 'productItems' });
ProductItem.belongsTo(Color, { foreignKey: 'color_id', as: 'color' });

// ===== PRODUCT ITEM - SIZE =====
Size.hasMany(ProductItem, { foreignKey: 'size_id', as: 'productItems' });
ProductItem.belongsTo(Size, { foreignKey: 'size_id', as: 'size' });

// ===== PRODUCT ITEM - MATERIAL =====
Material.hasMany(ProductItem, { foreignKey: 'materials_id', as: 'productItems' });
ProductItem.belongsTo(Material, { foreignKey: 'materials_id', as: 'material' });

// ===== PRODUCT ITEM - COUPON =====
Coupon.hasMany(ProductItem, { foreignKey: 'coupons_id', as: 'productItems' });
ProductItem.belongsTo(Coupon, { foreignKey: 'coupons_id', as: 'coupon' });

// ===== USER - ORDER =====
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ===== ORDER - ORDER ITEM - PRODUCT ITEM =====
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderItem.belongsTo(ProductItem, { foreignKey: 'productItemId', as: 'productItem' });
ProductItem.hasMany(OrderItem, { foreignKey: 'productItemId', as: 'orderItems' });

Order.belongsToMany(ProductItem, {
  through: OrderItem,
  foreignKey: 'orderId',
  as: 'productItems'
});
ProductItem.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: 'productItemId',
  as: 'orders'
});

// ===== USER - CART - CART ITEM - PRODUCT ITEM =====
User.hasOne(Cart, { foreignKey: 'users_id', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'users_id', as: 'user' });

Cart.hasMany(CartItem, { foreignKey: 'carts_id', as: 'cartItems' });
CartItem.belongsTo(Cart, { foreignKey: 'carts_id', as: 'cart' });

CartItem.belongsTo(ProductItem, { foreignKey: 'products_item_id', as: 'productItem' });

// ===== USER - REVIEW - PRODUCT =====
User.hasMany(Review, { foreignKey: 'users_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'users_id', as: 'user' });

Product.hasMany(Review, { foreignKey: 'products_id', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'products_id', as: 'product' });

 // ===== REPLY - REVIEW =====
Review.belongsTo(Review, { foreignKey: 'parent_id', as: 'parent' });
Review.hasMany(Review, { foreignKey: 'parent_id', as: 'replies' }); 

// ===== ROLE - USER =====
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// ===== USER - ADDRESS =====
User.hasOne(Address, { foreignKey: 'users_id', as: 'Address' });
Address.belongsTo(User, { foreignKey: 'users_id', as: 'user' });

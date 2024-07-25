const Coupon = require('./Coupon')
const Review = require('./Review')
const ProductImage = require('./ProductImages')
const User = require('./User')
const Order = require('./Order')
const Cart = require('./Cart')
const CartItem = require('./CartItem')
const OrderItem = require('./OrderItem')
const Product = require('./Product')
const Category = require('./Category')
const ProductItem = require('./ProductItem')
const Color = require('./Color')
const Address = require('./Address')
Review
// Category-Product
Category.hasMany(Product, {
    foreignKey: 'categoryId'
})

Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
})
Product.belongsTo(Coupon, {
    foreignKey: 'productCouponId',
    as: 'productCoupon'
})
Product.belongsToMany(Color, { through: ProductItem });
Color.belongsToMany(Product, { through: ProductItem });

Product.belongsTo(ProductItem, {
    foreignKey: 'id',
    as: 'Products_item'
})

Product.hasMany(ProductItem, {
    foreignKey: 'productId',
    as: 'productsDetail',
    sourceKey: 'id'
})
Product.hasMany(ProductItem, {
    foreignKey: 'productId',
    as: 'details',

})
// Product has many ProductItems
Product.hasMany(ProductItem, {
    foreignKey: 'productId',
    as: 'productItems'
});
User.hasOne(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });
// ProductItem belongs to Product
ProductItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product'
});

ProductItem.belongsTo(Color, {
    foreignKey: 'colorId',
    as: 'color'
})

ProductItem.belongsTo(Color, {
    foreignKey: 'colorId',
    as: 'colorInfo',
    sourceKey: 'id'

})
// Association to get replies
Review.hasMany(Review, { as: 'replies', foreignKey: 'parentId' });
Review.belongsTo(Review, { as: 'parent', foreignKey: 'parentId' });
// CustomerAddress.hasMany(CustomerAddressToObject, {
//     as: 'contact_persons',
//     foreignKey: 'customer_address_id',
//     sourceKey: 'id',
//     scope: {
//         status: CustomerAddressToObject.STATUS_ACTIVE,
//         type: CustomerAddressToObject.TYPE_PHONE
//     }
// });
// CustomerAddress.belongsTo(Customer, {
//     as: 'customer_info',
//     foreignKey: 'customer_id',
//     sourceKey: 'id',
// });

// Cart-CartItem
Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'cartItems'
})
CartItem.belongsTo(Cart, {
    foreignKey: 'cartId'
})


CartItem.belongsTo(ProductItem, { as: 'productItem', foreignKey: 'productItemId' });


Order.belongsToMany(ProductItem, {
    through: OrderItem,
    foreignKey: 'orderId',
    as: 'productitems'
})
OrderItem.belongsTo(ProductItem, { foreignKey: 'productItemId', as: 'productItem' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

ProductItem.hasMany(OrderItem, { foreignKey: 'productItemId', as: 'orderItems' });
Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });
ProductItem.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'productItemId',
    as: 'ordersItem'
})

// Order - User
User.hasMany(Order, {
    foreignKey: 'userId'
})

Order.belongsTo(User, {
    foreignKey: 'userId',
    as: 'users'
})
ProductImage.belongsTo(Product,
    {
        foreignKey: 'productId', as: 'product'


    });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'users' });

// Color.hasMany(CartItem, {
//     foreignKey: 'colorId'
// })
Product.hasMany(ProductImage, { as: 'images', foreignKey: 'productId' });
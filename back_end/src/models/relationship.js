// const Color = require('./Color.js')
// const Coupon = require('./Coupon.js')
// const Role = require('./Role')
// const User = require('./User')

const Cart = require('./Cart')
const CartItem = require('./CartItem')

const Product = require('./Product')
const Category = require('./Category')
const ProductItem = require('./ProductItem')
const Color = require('./Color')
// Category-Product
Category.hasMany(Product, {
    foreignKey: 'categoryId'
})

Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
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
ProductItem.belongsTo(Color, {
    foreignKey: 'colorId',
    as: 'colorInfo',
    sourceKey: 'id'

})
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

// CartItem-Product
CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'products'
})

Product.hasMany(CartItem, {
    foreignKey: 'productId'
})

// CartItem-Product
CartItem.belongsTo(Color, {
    foreignKey: 'colorId',
    as: 'colors'
})

Color.hasMany(CartItem, {
    foreignKey: 'colorId'
})
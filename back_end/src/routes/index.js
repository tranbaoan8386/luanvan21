
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const couponRouter = require('./couponRouter')
const reviewRouter = require('./reviewRouter')
const orderRouter = require('./orderRouter')
const colorRouter = require('./colorRouter')
const productRouter = require('./productRouter')
const productImageRouter = require('./productImageRouter')
const cartRouter = require('./cartRouter')
const handleRouters = (app) => {
    app.use('/api/v1/carts', cartRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/users', userRouter)
    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/coupons', couponRouter)
    app.use('/api/v1/reviews', reviewRouter)
    app.use('/api/v1/orders', orderRouter)
    app.use('/api/v1/colors', colorRouter)
    app.use('/api/v1/products', productRouter)
    app.use('/api/v1/productsImage', productImageRouter)
}

module.exports = handleRouters

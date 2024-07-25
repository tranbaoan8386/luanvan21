const { Router } = require('express')
const ProductController = require('../controllers/ProductController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const uploadMiddleware = require('../middlewares/uploadMiddleware')

const productRouter = Router()

productRouter.get('/', ProductController.getAllProduct)
productRouter.get('/:id', ProductController.getDetailProduct)
productRouter.post(
    '/',
    jwtAuthMiddleware,

    uploadMiddleware.single('image'),
    authorizedMiddleware('admin'),
    ProductController.createProduct
)
productRouter.patch(
    '/:id',
    jwtAuthMiddleware,

    uploadMiddleware.single('image'),
    authorizedMiddleware('admin'),
    ProductController.updateProduct
)

productRouter.get('/products/:id', ProductController.getProductWithImages);
productRouter.delete(
    '/:id',
    jwtAuthMiddleware,

    uploadMiddleware.single('image'),
    authorizedMiddleware('admin'),
    ProductController.deleteProduct
)

module.exports = productRouter

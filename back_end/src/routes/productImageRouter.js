const { Router } = require('express')
const uploadMiddleware = require('../middlewares/uploadMiddleware')

const ProductImageController = require('../controllers/ProductImageController')

const productImageRouter = Router()
productImageRouter.post(
    '/',
    uploadMiddleware.any('url'),
    ProductImageController.createProductImage
)

module.exports = productImageRouter


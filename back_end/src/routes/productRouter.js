const { Router } = require('express');
const ProductController = require('../controllers/ProductController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const productRouter = Router();

// List all products
productRouter.get('/', ProductController.getAllProduct);

// Get product with images by ID
productRouter.get('/:id', ProductController.getProductWithImages);

// Create a new product
productRouter.post(
    '/',
    jwtAuthMiddleware,
    uploadMiddleware.any(), // 👈 chấp nhận mọi field ảnh
    authorizedMiddleware('Admin'),
    ProductController.createProduct
  );
  


// Update an existing product
productRouter.patch(
    '/:id',
    jwtAuthMiddleware,
    uploadMiddleware.any(),
    authorizedMiddleware('Admin'),
    ProductController.updateProduct
  );
  


// Delete a product
productRouter.delete(
    '/:id',
    jwtAuthMiddleware,
    authorizedMiddleware('Admin'), // Không cần uploadMiddleware cho DELETE
    ProductController.deleteProduct
);

module.exports = productRouter;

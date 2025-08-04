const { Router } = require('express');
const ProductController = require('../controllers/ProductController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const productRouter = Router();

// ==================== INVENTORY (STOCK) ====================

// [GET] /api/v1/products/inventory
productRouter.get(
  '/inventory',
  // jwtAuthMiddleware,
  // authorizedMiddleware('Admin'),
  ProductController.getInventory
);

// [PATCH] /api/v1/products/inventory/:id
productRouter.patch(
  '/inventory/:id',
  // jwtAuthMiddleware,
  // authorizedMiddleware('Admin'),
  ProductController.updateStock
);



// ==================== CREATE ====================

// [POST] /api/v1/products
productRouter.post(
  '/',
  jwtAuthMiddleware,
  uploadMiddleware.any(),
  authorizedMiddleware('Admin'),
  ProductController.createProduct
);

// ==================== PRODUCT LISTING ====================

// [GET] /api/v1/products
productRouter.get('/', ProductController.getAllProduct);

// [GET] /api/v1/products/:id/images
productRouter.get('/:id/images', ProductController.getProductWithImages);

// [GET] /api/v1/products/:id
productRouter.get('/:id', ProductController.getDetailProduct);

// ==================== SOFT DELETE + RESTORE ====================

// [GET] /api/v1/products/deleted
productRouter.get(
  '/deleted',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  ProductController.getDeletedProducts
);

// [PATCH] /api/v1/products/restore/:id
productRouter.patch(
  '/restore/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  ProductController.restoreDeletedProduct
);

// ==================== UPDATE / DELETE ====================

// [PATCH] /api/v1/products/:id
productRouter.patch(
  '/:id',
  jwtAuthMiddleware,
  uploadMiddleware.any(),
  authorizedMiddleware('Admin'),
  ProductController.updateProduct
);

// [DELETE] /api/v1/products/:id
productRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  ProductController.deleteProduct
);

module.exports = productRouter;

// ==================== END ====================
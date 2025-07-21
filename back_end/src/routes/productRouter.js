const { Router } = require('express');
const ProductController = require('../controllers/ProductController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const productRouter = Router();

// ==================== INVENTORY (STOCK) ====================

// [GET] /api/v1/products/inventory
// Lấy danh sách tồn kho theo màu/size (Admin)
productRouter.get(
  '/inventory',
/*   jwtAuthMiddleware,
  authorizedMiddleware('Admin'), */
  ProductController.getInventory
);

// [PATCH] /api/v1/products/inventory/:id
//Cập nhật số lượng tồn kho của 1 sản phẩm item (Admin)
productRouter.patch(
  '/inventory/:id',
  // jwtAuthMiddleware,
  // authorizedMiddleware('Admin'),
  ProductController.updateStock
);

// ==================== PRODUCT LISTING ====================

// [GET] /api/v1/products
// 👉 Lấy danh sách tất cả sản phẩm
productRouter.get('/', ProductController.getAllProduct);

// [GET] /api/v1/products/:id
// 👉 Lấy chi tiết 1 sản phẩm theo ID
productRouter.get('/:id', ProductController.getDetailProduct);

// [GET] /api/v1/products/:id/images
// 👉 Lấy ảnh chi tiết theo sản phẩm
productRouter.get('/:id/images', ProductController.getProductWithImages);

// ==================== SOFT DELETE + RESTORE ====================

// [GET] /api/v1/products/deleted
// 👉 Lấy danh sách sản phẩm đã bị xoá mềm (Admin)
productRouter.get(
  '/deleted',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  ProductController.getDeletedProducts
);

// [PATCH] /api/v1/products/restore/:id
// Khôi phục sản phẩm đã xoá mềm (Admin)
productRouter.patch(
  '/restore/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  ProductController.restoreDeletedProduct
);



// ==================== CREATE / UPDATE / DELETE ====================

// [POST] /api/v1/products
// Thêm sản phẩm mới (Admin)
productRouter.post(
  '/',
  jwtAuthMiddleware,
  uploadMiddleware.any(),
  authorizedMiddleware('Admin'),
  ProductController.createProduct
);

// [PATCH] /api/v1/products/:id
// 👉 Cập nhật thông tin sản phẩm (Admin)
productRouter.patch(
  '/:id',
  jwtAuthMiddleware,
  uploadMiddleware.any(),
  authorizedMiddleware('Admin'),
  ProductController.updateProduct
);

// [DELETE] /api/v1/products/:id
// 👉 Xoá sản phẩm (Admin)
productRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  ProductController.deleteProduct
);

module.exports = productRouter;

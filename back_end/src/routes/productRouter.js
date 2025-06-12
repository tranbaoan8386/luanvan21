const { Router } = require('express');
const ProductController = require('../controllers/ProductController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

const productRouter = Router();

// [GET] /api/v1/products
// 👉 Lấy danh sách tất cả sản phẩm
productRouter.get('/', ProductController.getAllProduct);
<<<<<<< HEAD

// Get product with images by ID
productRouter.get('/:id/images', ProductController.getProductWithImages);
productRouter.get('/:id', ProductController.getDetailProduct);


// Create a new product
=======
// [GET] /api/v1/products/:id
// 👉 Lấy chi tiết 1 sản phẩm theo ID
productRouter.get('/:id', ProductController.getDetailProduct);
// [POST] /api/v1/products
// 👉 Thêm sản phẩm mới (chỉ Admin được phép)
//    - Cần xác thực JWT
//    - Cần có quyền Admin
//    - Cho phép upload nhiều file với mọi field (dùng .any())
>>>>>>> bb7ef2b56946aea9747c52f12512e6a76b6b72cb
productRouter.post(
  '/',
  jwtAuthMiddleware,               // Xác thực người dùng đã đăng nhập
  uploadMiddleware.any(),         // Cho phép upload ảnh (avatar + ảnh theo màu)
  authorizedMiddleware('Admin'),  // Kiểm tra quyền Admin
  ProductController.createProduct // Gọi controller để xử lý thêm sản phẩm
);
// [PATCH] /api/v1/products/:id
// 👉 Cập nhật thông tin sản phẩm (chỉ Admin)
//    - Xác thực JWT
//    - Cho phép upload ảnh
productRouter.patch(
  '/:id',
  jwtAuthMiddleware,
  uploadMiddleware.any(),
  authorizedMiddleware('Admin'),
  ProductController.updateProduct
);
// [DELETE] /api/v1/products/:id
// 👉 Xoá sản phẩm theo ID (chỉ Admin)
//    - Không cần upload ảnh
productRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  ProductController.deleteProduct
);


module.exports = productRouter;


//File này giúp định nghĩa các đường dẫn (API endpoints)
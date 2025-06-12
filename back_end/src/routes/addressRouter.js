const { Router } = require('express');
const AddressController = require('../controllers/AddressController');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const AddressSchema = require('../validations/AddressSchema');

const AddressRouter = Router();

// Lấy địa chỉ theo user đã đăng nhập
AddressRouter.get('/me', jwtAuthMiddleware, AddressController.getAddressById);

// Tạo địa chỉ
AddressRouter.post(
  '/',
  jwtAuthMiddleware,
  validatorMiddleware(AddressSchema.createAddress),
  AddressController.createAddress
);

// Cập nhật địa chỉ
AddressRouter.patch(
  '/:id',
  jwtAuthMiddleware,
  validatorMiddleware(AddressSchema.updateAddress),
  AddressController.updateAddress
);

module.exports = AddressRouter;

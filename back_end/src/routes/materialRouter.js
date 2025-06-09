const { Router } = require('express');
const authorizedMiddleware = require('../middlewares/authorizedMiddleware');
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const MaterialController = require('../controllers/MaterialController');
const MaterialSchema = require('../validations/MaterialSchema');

const materialRouter = Router();

materialRouter.post(
  '/',
  jwtAuthMiddleware,
  validatorMiddleware(MaterialSchema.createMaterial),
  authorizedMiddleware('Admin'),
  MaterialController.createMaterial
);

materialRouter.get('/', MaterialController.getAllMaterial);
materialRouter.get('/:id', MaterialController.getMaterial);

materialRouter.patch(
  '/:id',
  jwtAuthMiddleware,
  validatorMiddleware(MaterialSchema.updateMaterial),
  authorizedMiddleware('Admin'),
  MaterialController.updateMaterial
);

materialRouter.delete(
  '/:id',
  jwtAuthMiddleware,
  authorizedMiddleware('Admin'),
  MaterialController.deleteMaterial
);

module.exports = materialRouter;

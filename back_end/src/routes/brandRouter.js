const { Router } = require('express')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const BrandController = require('../controllers/BrandController')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const BrandSchema = require('../validations/BrandSchema')


const brandRouter = Router()

brandRouter.get('/', BrandController.getAllBrand)

brandRouter.get('/:id', BrandController.getBrand)

brandRouter.post(
    '/',
    jwtAuthMiddleware,
    validatorMiddleware(BrandSchema.createBrand),
    authorizedMiddleware('Admin'),
    BrandController.createBrand
)
brandRouter.patch(
    '/:id',
    jwtAuthMiddleware,
    validatorMiddleware(BrandSchema.updateBrand),
    authorizedMiddleware('Admin'),
    BrandController.updateBrand
)

brandRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), BrandController.deleteBrand)

module.exports = brandRouter
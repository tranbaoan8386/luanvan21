const { Router } = require('express')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const SizeController = require('../controllers/SizeController')
const SizeSchema = require('../validations/SizeSchema')

const sizeRouter = Router()
sizeRouter.post(
    '/',
    jwtAuthMiddleware,
    validatorMiddleware(SizeSchema.createSize),
    authorizedMiddleware('Admin'),
    SizeController.createSize
)

sizeRouter.get('/', SizeController.getAllSize)
sizeRouter.get('/:id', SizeController.getSize)
sizeRouter.patch(
    '/:id',
    jwtAuthMiddleware,
    validatorMiddleware(SizeSchema.updateSize),
    authorizedMiddleware('Admin'),
    SizeController.updateSize
)
sizeRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('Admin'), SizeController.deleteSize)
module.exports = sizeRouter

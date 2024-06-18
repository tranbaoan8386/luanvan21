const { Router } = require('express')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const ColorController = require('../controllers/ColorController')
const ColorSchema = require('../validations/ColorSchema')

const colorRouter = Router()
colorRouter.post(
    '/',
    jwtAuthMiddleware,
    validatorMiddleware(ColorSchema.createColor),
    authorizedMiddleware('admin'),
    ColorController.createColor
)

colorRouter.get('/', jwtAuthMiddleware,
    authorizedMiddleware('admin'), ColorController.getAllColor)
colorRouter.get('/:id', ColorController.getColor)
colorRouter.patch(
    '/:id',
    jwtAuthMiddleware,
    validatorMiddleware(ColorSchema.updateColor),
    authorizedMiddleware('admin'),
    ColorController.updateColor
)
colorRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('admin'), ColorController.deleteColor)
module.exports = colorRouter

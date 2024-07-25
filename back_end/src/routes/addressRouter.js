const { Router } = require('express')
const AddressController = require('../controllers/AddressController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const AddressSchema = require('../validations/AddressSchema')

const AddressRouter = Router()

AddressRouter.get('/:id', AddressController.getAddressById)
AddressRouter.post('/', jwtAuthMiddleware, validatorMiddleware(AddressSchema.createAddress), AddressController.createAddress)
AddressRouter.patch('/:id', AddressController.updateAddress)
module.exports = AddressRouter

const { Router } = require('express')
const ReviewController = require('../controllers/ReviewController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const ReviewSchema = require('../validations/ReviewSchema')

const reviewRouter = Router()

reviewRouter.get('/', jwtAuthMiddleware, authorizedMiddleware('owner'), ReviewController.getAllReview)
reviewRouter.get('/product/:id', ReviewController.getAllReviewProduct)
reviewRouter.post(
    '/',
    jwtAuthMiddleware,
    authorizedMiddleware('customer'),
    validatorMiddleware(ReviewSchema.createReview),
    ReviewController.createReview
)
reviewRouter.patch(
    '/:id',
    jwtAuthMiddleware,
    authorizedMiddleware('customer'),
    validatorMiddleware(ReviewSchema.updateReview),
    ReviewController.updateReview
)

reviewRouter.patch('/hidden/:id', jwtAuthMiddleware, authorizedMiddleware('owner'), ReviewController.hiddenReview)
reviewRouter.delete('/:id', jwtAuthMiddleware, authorizedMiddleware('owner'), ReviewController.deleteReview)
module.exports = reviewRouter

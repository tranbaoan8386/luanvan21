const { Router } = require('express')
const ReviewController = require('../controllers/ReviewController')
const jwtAuthMiddleware = require('../middlewares/jwtAuthMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const validatorMiddleware = require('../middlewares/validatorMiddleware')
const ReviewSchema = require('../validations/ReviewSchema')

const reviewRouter = Router()

reviewRouter.get('/', ReviewController.getAllReview)
reviewRouter.get('/product/:id', ReviewController.getAllReviewProduct),
    reviewRouter.post('/',
        jwtAuthMiddleware,

        validatorMiddleware(ReviewSchema.createReview), ReviewController.createReview)
reviewRouter.post(
    '/reply',
    jwtAuthMiddleware,
    authorizedMiddleware('Admin'),
    ReviewController.createReply
)
reviewRouter.patch(
    '/:id',

    validatorMiddleware(ReviewSchema.updateReview),
    ReviewController.updateReview
)

reviewRouter.patch('/hidden/:id', ReviewController.hiddenReview)
reviewRouter.delete('/:id', ReviewController.deleteReview)
module.exports = reviewRouter

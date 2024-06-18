const Review = require('../models/Review')
const ApiResponse = require('../response/ApiResponse')
const User = require('../models/User')

class ReviewController {
    async getAllReview(req, res, next) {
        try {
            const reviews = await Review.findAll({
                where: {
                    isHidden: false
                }
            })

            return new ApiResponse(res, {
                status: 200,
                data: reviews
            })
        } catch (err) {
            next(err)
        }
    }

    async getAllReviewProduct(req, res, next) {
        try {
            const { id: productId } = req.params
            const reviews = await Review.findAll({
                where: { productId, isHidden: false },
                include: [
                    {
                        model: User,
                        as: 'users'
                    }
                ]
            })
            if (reviews.length <= 0) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Chưa có lượt đánh giá nào'
                    }
                })
            }
            return ApiResponse.success(res, {
                status: 200,
                data: reviews
            })
        } catch (err) {
            next(err)
        }
    }

    async createReview(req, res, next) {
        try {
            const { id: userId } = req.user
            const { comment, rating, productId } = req.body

            const review = await Review.create({
                comment,
                rating,
                productId,
                userId
            })

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    review
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async updateReview(req, res, next) {
        try {
            const { id: reviewId } = req.params
            const { comment, rating } = req.body

            const review = await Review.findOne({
                where: { id: reviewId }
            })

            if (!review) {
                throw new ErrorResponse(404, 'Không tìm thấy đánh giá')
            }
            review.comment = comment
            review.rating = rating

            await review.save()
            return new ApiResponse(res, {
                status: 200,
                data: review
            })
        } catch (err) {
            next(err)
        }
    }

    async hiddenReview(req, res, next) {
        try {
            const { id: reviewId } = req.params

            const review = await Review.findOne({
                where: { id: reviewId }
            })

            if (!review) {
                throw new ErrorResponse(404, 'Không tìm thấy đánh giá')
            }
            review.isHidden = true

            await review.save()
            return new ApiResponse(res, {
                status: 200,
                data: review
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteReview(req, res, next) {
        try {
            const { id: reviewId } = req.params

            const review = await Review.findOne({
                where: { id: reviewId }
            })

            if (!review) {
                throw new ErrorResponse(404, 'Không tìm thấy đánh giá')
            }
            await review.destroy()
            return new ApiResponse(res, {
                status: 200,
                data: review
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ReviewController()

const Review = require('../models/Review')
const ApiResponse = require('../response/ApiResponse')
const User = require('../models/User')
const Order = require('../models/Order')
const OrderItem = require('../models/OrderItem')
const ProductItem = require('../models/ProductItem')

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
            const { id: productId } = req.params;
            const reviews = await Review.findAll({
                where: {
                  products_id: productId // ✅ sửa lại đúng tên cột
                },
                include: [
                  {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name']
                  }
                ]
              });
              
    
            if (reviews.length === 0) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Chưa có lượt đánh giá nào'
                    }
                });
            }
    
            return ApiResponse.success(res, {
                status: 200,
                data: reviews
            });
        } catch (err) {
            console.error('❌ Lỗi khi lấy đánh giá sản phẩm:', err);
            next(err);
        }
    }
    


    // reviewController.js
    async createReview(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { comment, rating, productId } = req.body;
    
            // Kiểm tra các trường bắt buộc
            if (!userId || !comment || !rating || !productId) {
                return ApiResponse.error(res, {
                    status: 400,
                    message: "Thiếu thông tin bắt buộc."
                });
            }
    
            // Kiểm tra xem người dùng đã mua sản phẩm này chưa
            const hasPurchased = await Order.findOne({
                where: {
                    userId,
                    status: 'delivered'
                },
                include: [{
                    model: OrderItem,
                    as: 'items',
                    include: [{
                        model: ProductItem,
                        as: 'productItem',
                        where: {
                            products_id: productId
                        }
                    }]
                }]
            });
    
            if (!hasPurchased) {
                return ApiResponse.error(res, {
                    status: 403,
                    message: "Bạn cần mua sản phẩm này trước khi đánh giá"
                });
            }
    
            // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
            const existingReview = await Review.findOne({
                where: {
                    userId,
                    products_id: productId,
                    parentId: null
                }
            });
    
            if (existingReview) {
                return ApiResponse.error(res, {
                    status: 400,
                    message: "Bạn đã đánh giá sản phẩm này rồi"
                });
            }
    
            // Tạo đánh giá mới
            const review = await Review.create({
                comment,
                rating,
                products_id: productId, // đây là tên cột DB
                userId,
                parentId: null
            });
    
            return ApiResponse.success(res, {
                status: 201,
                message: "Đánh giá sản phẩm thành công",
                data: review
            });
        } catch (err) {
            console.error('Lỗi tạo review:', err); // THÊM log chi tiết
            return ApiResponse.error(res, {
                status: 500,
                message: "Có lỗi xảy ra khi tạo đánh giá"
            });
        }
    }
    


    async createReply(req, res, next) {
        try {
            console.log("req.user:", req.user); // Kiểm tra xem req.user có tồn tại và chứa id không

            if (!req.user) {
                return res.status(401).json({ message: "Không được phép" });
            }

            const { id: userId } = req.user;
            const { comment, reviewId } = req.body;

            console.log("Received data:", { userId, comment, reviewId });

            if (!userId || !comment || !reviewId) {
                return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
            }

            // Kiểm tra xem đánh giá gốc có tồn tại không
            const originalReview = await Review.findByPk(reviewId);
            console.log("Original review:", originalReview); // Thêm log để kiểm tra kết quả truy vấn

            if (!originalReview) {
                return res.status(404).json({ message: "Đánh giá không tồn tại." });
            }

            const reply = await Review.create({
                comment,
                rating: originalReview.rating, // Sử dụng rating của đánh giá gốc hoặc giá trị mặc định là 0
                products_id: originalReview.products_id
,
                userId,
                parentId: reviewId // Thiết lập parentId để chỉ định đây là phản hồi
            });

            return res.status(201).json({
                status: "success",
                data: {
                    reply
                }
            });
        } catch (err) {
            console.error(err); // Log lỗi chi tiết
            next(err);
        }
    }


    async updateReview(req, res, next) {
        try {
            const { id: reviewId } = req.params;
            const { comment, rating } = req.body;
    
            const review = await Review.findByPk(reviewId);
    
            if (!review) {
                throw new ErrorResponse(404, 'Không tìm thấy đánh giá');
            }
    
            review.comment = comment;
            review.rating = rating;
    
            await review.save();
    
            return new ApiResponse(res, {
                status: 200,
                message: 'Cập nhật đánh giá thành công',
                data: review
            });
        } catch (err) {
            next(err);
        }
    }
    

    async hiddenReview(req, res, next) {
        try {
            const { id: reviewId } = req.params;
    
            const review = await Review.findByPk(reviewId);
    
            if (!review) {
                throw new ErrorResponse(404, 'Không tìm thấy đánh giá');
            }
    
            review.isHidden = !review.isHidden;
    
            await review.save();
    
            return new ApiResponse(res, {
                status: 200,
                message: review.isHidden ? 'Đã ẩn đánh giá' : 'Đã hiện lại đánh giá',
                data: review
            });
        } catch (err) {
            next(err);
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
                message: 'Xoá đánh giá thành công',
                data: review
            });            
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ReviewController()

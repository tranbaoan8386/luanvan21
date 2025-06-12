const Category = require('../models/Category')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const { Op } = require("sequelize");


class CategoryController {
    async getAllCategory(req, res, next) {
        try {
            const categories = await Category.findAll({})

            return new ApiResponse(res, {
                status: 200,
                data: categories
            })
        } catch (err) {
            next(err)
        }
    }

    async getCategory(req, res, next) {
        try {
            const { id } = req.params
            const category = await Category.findByPk(id)
            if (!category) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy'
                    }
                })
            }
            return ApiResponse.success(res, {
                status: 200,
                data: category
            })
        } catch (err) {
            next(err)
        }
    }
    async createCategory(req, res, next) {
        try {

            const { name } = req.body;

            // Kiểm tra xem tên danh mục đã tồn tại chưa
            const existingCategory = await Category.findOne({
                where: { name }
            });

            if (existingCategory) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        field: 'name', // Tên trường gây lỗi
                        message: 'Tên danh mục đã bị trùng'
                    }
                });
            }

            // Nếu không trùng, tiến hành tạo mới
            const category = await Category.create(req.body)

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    category,
                    message: 'Tạo danh mục sản phẩm thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async updateCategory(req, res, next) {
        try {
            const { name } = req.body
            const { id } = req.params
            const category = await Category.findOne({
                where: {
                    id
                }
            })
            if (!category) {
                return ApiResponse.error(res, {
                    status: 404,
                    message: 'Không tìm thấy danh mục'
                })
            }

            // Kiểm tra xem tên danh mục đã tồn tại chưa
            const existingCategory = await Category.findOne({
                where: {
                    name,
                    id: { [Op.ne]: id } // ⚠️ loại chính mình
                }
            });
            

            if (existingCategory) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        field: 'name', // Tên trường gây lỗi
                        message: 'Tên danh mục đã bị trùng'
                    }
                });
            }
            
            category.name = name
            await category.save()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    category,
                    message: 'Cập nhật danh mục sản phẩm thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params
            const category = await Category.findOne({
                where: {
                    id
                }
            })
            if (!category) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy danh mục'
                    }
                })
            }
            await category.destroy()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    category,
                    message: 'Xóa danh mục thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new CategoryController()

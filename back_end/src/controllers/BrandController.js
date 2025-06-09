const Brand = require('../models/Brand')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')

class BrandController {
    async getAllBrand(req, res, next) {
        try {
            const brands = await Brand.findAll({})

            return new ApiResponse(res, {
                status: 200,
                data: brands
            })
        } catch (err) {
            next(err)
        }
    }

    async getBrand(req, res, next) {
        try {
            const { id } = req.params
            const brand = await Brand.findByPk(id)
            if (!brand) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy'
                    }
                })
            }
            return ApiResponse.success(res, {
                status: 200,
                data: brand
            })
        } catch (err) {
            next(err)
        }
    }
    async createBrand(req, res, next) {
        try {

            const { name } = req.body;

            // Kiểm tra xem tên thương hiệu đã tồn tại chưa
            const existingBrand = await Brand.findOne({
                where: { name }
            });

            if (existingBrand) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        field: 'name', // Tên trường gây lỗi
                        message: 'Tên thương hiệu đã bị trùng'
                    }
                });
            }
            
            const brand = await Brand.create(req.body)

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    brand,
                    message: 'Tạo thương hiệu sản phẩm thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async updateBrand(req, res, next) {
        try {
            const { name } = req.body
            const { id } = req.params
            const brand = await Brand.findOne({
                where: {
                    id
                }
            })
            if (!brand) {
                return ApiResponse.error(res, {
                    status: 404,
                    message: 'Không tìm thấy thương hiệu'
                })
            }

            // Kiểm tra xem tên thương hiệu đã tồn tại chưa
            const existingBrand = await Brand.findOne({
                where: { name }
            });

            if (existingBrand) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        field: 'name', // Tên trường gây lỗi
                        message: 'Tên thương hiệu đã bị trùng'
                    }
                });
            }
            
            brand.name = name
            await brand.save()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    brand,
                    message: 'Cập nhật thương hiệu sản phẩm thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteBrand(req, res, next) {
        try {
            const { id } = req.params
            const brand = await Brand.findOne({
                where: {
                    id
                }
            })
            if (!brand) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy thương hiệu'
                    }
                })
            }
            await brand.destroy()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    brand,
                    message: 'Xóa thương hiệu thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new BrandController()

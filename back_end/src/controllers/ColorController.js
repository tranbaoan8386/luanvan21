const Color = require('../models/Color')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
class ColorController {
    async createColor(req, res, next) {
        try {
            const color = await Color.create(req.body)

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    color,
                    message: 'Thêm màu thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
    async getAllColor(req, res, next) {
        try {
            const color = await Color.findAll({

            })

            return ApiResponse.success(res, {
                status: 200,
                data: color
            })
        } catch (err) {
            next(err)
        }
    }
    async getColor(req, res, next) {
        try {
            const { id } = req.params
            const color = await Color.findByPk(id)
            if (!color) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy'
                    }
                })
            }
            return ApiResponse.success(res, {
                status: 200,
                data: color
            })
        } catch (err) {
            next(err)
        }
    }

    async updateColor(req, res, next) {
        try {
            const { name } = req.body
            const { id } = req.params
            const color = await Color.findOne({
                where: {
                    id
                }
            })
            if (!color) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        color,
                        message: 'Không tìm thấy màu'
                    }
                })
            }
            color.name = name
            await color.save()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    color,
                    message: 'Cập nhật màu thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
    async deleteColor(req, res, next) {
        try {
            const { id } = req.params
            const color = await Color.findOne({
                where: {
                    id
                }
            })
            if (!color) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy thương hiệu'
                    }
                })
            }
            await color.destroy()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    color,
                    message: 'Xóa màu thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new ColorController()

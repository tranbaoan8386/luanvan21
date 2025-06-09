const Size = require('../models/Size')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
class SizeController {
    async createSize(req, res, next) {
        try {
            const size = await Size.create(req.body)

            return ApiResponse.success(res, {
                status: 201,
                data: {
                    size,
                    message: 'Thêm size thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
    async getAllSize(req, res, next) {
        try {
            const size = await Size.findAll({

            })

            return ApiResponse.success(res, {
                status: 200,
                data: size
            })
        } catch (err) {
            next(err)
        }
    }
    async getSize(req, res, next) {
        try {
            const { id } = req.params
            const size = await Size.findByPk(id)
            if (!size) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy'
                    }
                })
            }
            return ApiResponse.success(res, {
                status: 200,
                data: size
            })
        } catch (err) {
            next(err)
        }
    }

    async updateSize(req, res, next) {
        try {
            const { name } = req.body
            const { id } = req.params
            const size = await Size.findOne({
                where: {
                    id
                }
            })
            if (!size) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        size,
                        message: 'Không tìm thấy size'
                    }
                })
            }

            size.name = name
            await size.save()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    size,
                    message: 'Cập nhật size thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
    
    async deleteSize(req, res, next) {
        try {
            const { id } = req.params
            const size = await Size.findOne({
                where: {
                    id
                }
            })
            if (!size) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy size'
                    }
                })
            }
            await size.destroy()

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    size,
                    message: 'Xóa size thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new SizeController()

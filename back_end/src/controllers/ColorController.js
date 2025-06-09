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
          const color = await Color.findAll();
          return ApiResponse.success(res, {
            status: 200,
            data: color
          });
        } catch (err) {
          console.error("❌ Lỗi khi lấy colors:", err.message);
          console.error(err.stack);
          res.status(500).json({ error: "Internal server error" });
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

    // Controller: Cập nhật thông tin màu theo ID
    async updateColor(req, res, next) {
        try {
            // Lấy dữ liệu từ request body và params
            const { name, colorCode } = req.body;
            const { id } = req.params;

            // Tìm màu cần cập nhật theo ID
            const color = await Color.findOne({
                where: { id }
            });

            // Nếu không tìm thấy màu
            if (!color) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        color,
                        message: 'Không tìm thấy màu'
                    }
                });
            }

            // Gán giá trị mới
            color.name = name;
            color.colorCode = colorCode;

            // Lưu vào database
            await color.save();

            // Trả về kết quả thành công
            return ApiResponse.success(res, {
                status: 200,
                data: {
                    color,
                    message: 'Cập nhật màu thành công'
                }
            });
        } catch (err) {
            // Xử lý lỗi
            next(err);
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
                        message: 'Không tìm thấy màu'
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

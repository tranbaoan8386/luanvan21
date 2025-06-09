const Material = require('../models/Material')
const ApiResponse = require('../response/ApiResponse')

class MaterialController {
  async createMaterial(req, res, next) {
    try {
      const material = await Material.create(req.body)

      return ApiResponse.success(res, {
        status: 201,
        data: {
          material,
          message: 'Thêm chất liệu thành công'
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async getAllMaterial(req, res, next) {
    try {
      const materials = await Material.findAll()

      return ApiResponse.success(res, {
        status: 200,
        data: materials
      })
    } catch (err) {
      next(err)
    }
  }

  async getMaterial(req, res, next) {
    try {
      const { id } = req.params
      const material = await Material.findByPk(id)
      if (!material) {
        return ApiResponse.error(res, {
          status: 404,
          data: {
            message: 'Không tìm thấy chất liệu'
          }
        })
      }

      return ApiResponse.success(res, {
        status: 200,
        data: material
      })
    } catch (err) {
      next(err)
    }
  }

  async updateMaterial(req, res, next) {
    try {
      const { id } = req.params
      const { name } = req.body
      const material = await Material.findByPk(id)

      if (!material) {
        return ApiResponse.error(res, {
          status: 404,
          data: {
            message: 'Không tìm thấy chất liệu'
          }
        })
      }

      material.name = name
      await material.save()

      return ApiResponse.success(res, {
        status: 200,
        data: {
          material,
          message: 'Cập nhật chất liệu thành công'
        }
      })
    } catch (err) {
      next(err)
    }
  }

  async deleteMaterial(req, res, next) {
    try {
      const { id } = req.params
      const material = await Material.findByPk(id)

      if (!material) {
        return ApiResponse.error(res, {
          status: 404,
          data: {
            message: 'Không tìm thấy chất liệu'
          }
        })
      }

      await material.destroy()

      return ApiResponse.success(res, {
        status: 200,
        data: {
          material,
          message: 'Xóa chất liệu thành công'
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new MaterialController()

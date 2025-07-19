const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const { env } = require('../config/env')
const { Op } = require('sequelize')
const Role = require('../models/Role')

const Address = require('../models/Address')

class UserController {
    async getAll(req, res, next) {
        try {
          const { deleted } = req.query;
      
          const isDeleted = deleted === 'true';
      
          const users = await User.findAll({
            where: {
              isDeleted, // lọc theo trạng thái xoá
            },
            include: [
              {
                model: Role,
                as: 'role',
                where: {
                  name: {
                    [Op.not]: 'Admin'
                  }
                }
              }
            ]
          });
      
          return ApiResponse.success(res, {
            status: 200,
            data: { users }
          });
        } catch (error) {
          console.log("🚨 ERROR GET USERS:", error);
          next(error);
        }
      }
      
    async getMe(req, res, next) {
  try {
    const { id: userId } = req.user;

    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: Address,
          as: 'Address',       // Đúng alias đã khai báo trong quan hệ
          required: false      // Tránh lỗi nếu user chưa có địa chỉ
        }
      ]
    });

    return ApiResponse.success(res, {
      success: true,
      data: {
        profile: user
      }
    });
  } catch (err) {
    // In lỗi chi tiết ra console để debug lỗi 500
    console.error(' Lỗi tại getMe:', err);
    next(err);
  }
}

    async getUser(req, res, next) {
        try {
            const { id: userId } = req.params
            const user = await User.findByPk(userId)
            if (!user) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy user'
                    }
                })
            }
            return ApiResponse.success(res, {
                status: 200,
                data: user
            })
        } catch (err) {
            next(err)
        }
    }

    async updateMe(req, res, next) {
        try {
          const { name, phone } = req.body;
          const { id: userId } = req.user;
      
          // Chuẩn bị đối tượng cập nhật
          const updateData = {};
      
          if (name?.trim()) {
            updateData.name = name.trim();
          }
      
          if (phone?.trim()) {
            updateData.phone = phone.trim();
          }
      
          if (req.file) {
            updateData.avatar = req.file.filename;
          }
      
          // Nếu có dữ liệu để cập nhật thì update
          if (Object.keys(updateData).length > 0) {
            await User.update(updateData, {
              where: { id: userId }
            });
          }
      
          // Lấy lại user sau khi cập nhật (loại bỏ password)
          const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
          });
      
          return ApiResponse.success(res, {
            status: 200,
            data: {
              profile: user, // đúng key frontend đang dùng
              message: 'Cập nhật thông tin thành công'
            }
          });
        } catch (err) {
          console.error(" Lỗi tại updateMe:", err);
          next(err);
        }
      }
      
      
      

    async updatePassword(req, res, next) {
        try {
            const { id: userId } = req.user;
            const { oldPassword, newPassword } = req.body;
    
            const user = await User.findByPk(userId);
    
            if (!user) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy người dùng'
                    }
                });
            }
    
            // Nếu không có mật khẩu trong DB (user.password null) => báo lỗi luôn
            if (!user.password) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        message: 'Người dùng chưa thiết lập mật khẩu'
                    }
                });
            }
    
            const isMatch = bcrypt.compareSync(oldPassword, user.password);
            if (!isMatch) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        oldPassword: 'Mật khẩu cũ không chính xác'
                    }
                });
            }
    
            if (oldPassword === newPassword) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        newPassword: 'Mật khẩu mới phải khác mật khẩu cũ'
                    }
                });
            }
    
            const hashedPassword = bcrypt.hashSync(newPassword);
            user.password = hashedPassword;
            await user.save();
    
            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: 'Cập nhật mật khẩu thành công'
                }
            });
        } catch (err) {
            console.error(" updatePassword error:", err); // Ghi log chi tiết
            next(err);
        }
    }
    

    async logout(req, res, next) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '')

            if (!token) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tồn tại 1'
                    }
                })
            }
            const isTokenValid = jwt.verify(token, env.SECRET_KEY)
            if (!isTokenValid) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tồn tại 2'
                    }
                })
            }

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: 'Đăng xuất tài khoản thành công'
                }
            })
        } catch (err) {
            next(err)
        }
    }
    async deleteUser(req, res, next) {
        try {
            const { id: userId } = req.params;

            // Find the user by ID
            const user = await User.findByPk(userId);

            // If user is not found, return an error response
            if (!user) {
                return ApiResponse.error(res, {
                    status: 404,
                    message: 'User not found'
                });
            }

            // Delete the user
            user.isDeleted = true;
            await user.save();

            // Return success response
            return ApiResponse.success(res, {
                status: 200,
                message: 'User deleted successfully'
            });
        } catch (err) {
            next(err);
        }
    }

    async restoreUser(req, res, next) {
        try {
            const { id: userId } = req.params;
            const user = await User.findByPk(userId);
    
            if (!user || !user.isDeleted) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Người dùng không tồn tại hoặc chưa bị xoá'
                    }
                });
            }
    
            user.isDeleted = false;
            await user.save();
    
            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: 'Khôi phục người dùng thành công'
                }
            });
        } catch (err) {
            next(err);
        }
    }
    

    async toggleUserActive(req, res, next) {
        try {
            const { id: userId } = req.params;
            const user = await User.findByPk(userId);

            if (!user) {
                return ApiResponse.error(res, {
                    status: 404,
                    data: {
                        message: 'Không tìm thấy người dùng'
                    }
                });
            }

            // Toggle trạng thái isActive
            user.isActive = !user.isActive;
            await user.save();

            return ApiResponse.success(res, {
                status: 200,
                data: {
                    message: `Đã ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'} người dùng thành công`
                }
            });
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new UserController()

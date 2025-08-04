const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Role = require('../models/Role')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const Otp = require('../models/OtpToken')



const EmailService = require('../services/EmailService')
/* const ForgotToken = require('../models/mongo/ForgotToken') */
const randomBytes = require('../utils/randomBytes')
const { env } = require('../config/env')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('307086193257-v5iln2iovnbrsuoe99co5scevo46qih8.apps.googleusercontent.com');

class AuthController {
   
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
    
            // Kiểm tra xem email đã tồn tại chưa
            const isExistEmail = await User.findOne({
                where: { email }
            });
    
            if (isExistEmail) {
                return ApiResponse.error(res, {
                    status: 400,
                    data: {
                        email: 'Email đã tồn tại'
                    }
                });
            }
    
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            // Tạo tài khoản mới
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                roleId: 2
            });
    
            // Trả về phản hồi thành công
            return ApiResponse.success(res, {
                status: 201,
                data: {
                    message: 'Đăng ký tài khoản thành công',
                    user
                }
            });
    
        } catch (err) {
            console.error('❌ Lỗi tại register:', err);
            next(err);
        }
    }
    

   
    async login(req, res, next) {
        try {
        const { email, password } = req.body;

        // Lấy user kèm role
        const user = await User.findOne({
            where: { email },
            include: {
    model: Role,
    as: 'role',
    attributes: ['id', 'name'] 
    }

        });

        if (!user) {
            return ApiResponse.error(res, {
            status: 401,
            data: {
                message: 'Email hoặc mật khẩu không chính xác'
            }
            });
        }

        if (!user.isActive) {
            return ApiResponse.error(res, {
            status: 403,
            data: {
                message: 'Tài khoản đã bị vô hiệu hóa'
            }
            });
        }

        const isMatchPassword = bcrypt.compareSync(password, user.password);
        if (!isMatchPassword) {
            return ApiResponse.error(res, {
            status: 400,
            data: {
                password: 'Mật khẩu chưa chính xác'
            }
            });
        }

        // Token chứa ID
        const token = jwt.sign(
            {
            id: user.id
            },
            env.SECRET_KEY,
            {
            expiresIn: '5d'
            }
        );

        // Trả về role đầy đủ
        const userFinal = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role // Trả về object: { id, name }
        };

        return ApiResponse.success(res, {
            status: 200,
            data: {
            message: 'Đăng nhập thành công',
            user: userFinal,
            token
            }
        });
        } catch (err) {
        console.error('Lỗi trong login():', err); 
        next(err);
        }
    }

async forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống');
    }


    const existedOtp = await Otp.findOne({ where: { email } });
    if (existedOtp) {
      await Otp.destroy({ where: { email } });
    }


    const code = Math.floor(1000 + Math.random() * 9000);

    
    
    await Otp.create({
      email,
      otp: code.toString(),
    });

    const message = `Mã xác nhận của bạn là: ${code}. Mã này sẽ hết hạn sau 1 giờ.`;

    await EmailService.sendMail(
      user.email,
      "Mã xác nhận khôi phục mật khẩu",
      `<p>${message}</p>`
    );

    return res.status(200).json({
      status: 200,
      message: 'Vui lòng kiểm tra email để lấy mã xác nhận khôi phục mật khẩu'
    });
  } catch (err) {
    console.error('Lỗi trong forgotPassword:', err);

    if (err.message && err.message.includes('invalid_client')) {
      return res.status(401).json({
        success: false,
        message: 'Thông tin xác thực của dịch vụ email không hợp lệ'
      });
    }

    next(err);
  }
}

async googleLogin(req, res, next) {
    try {
      const { token } = req.body;
      console.log('📦Google token nhận được:', token);   
  
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '307086193257-v5iln2iovnbrsuoe99co5scevo46qih8.apps.googleusercontent.com',
      });
  
      const payload = ticket.getPayload();
      const { email, name, picture } = payload;
  
      let user = await User.findOne({
        where: { email },
        include: {
          model: Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      });
  
      // Nếu chưa có tài khoản → tạo mới
      if (!user) {
        user = await User.create({
          name,
          email,
          password: null,
          avatar: picture,
          roleId: 2,        // role mặc định (user)
          isActive: true,
          verified: true,   // xác thực email luôn
        });
  
        // Load lại user kèm role
        user = await User.findOne({
          where: { email },
          include: {
            model: Role,
            as: 'role',
            attributes: ['id', 'name'],
          },
        });
      }
  
      if (!user.isActive) {
        return ApiResponse.error(res, {
          status: 403,
          data: {
            message: 'Tài khoản đã bị vô hiệu hóa',
          },
        });
      }
  
      // Tạo JWT token
      const accessToken = jwt.sign({ id: user.id }, env.SECRET_KEY, {
        expiresIn: '5d',
      });
  
      // Trả về user cuối
      const userFinal = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      };
  
      return ApiResponse.success(res, {
        status: 200,
        data: {
          message: 'Đăng nhập bằng Google thành công',
          user: userFinal,
          token: accessToken,
        },
      });
    } catch (err) {
      console.error('Lỗi trong googleLogin:', err);
      return ApiResponse.error(res, {
        status: 401,
        data: {
          message: 'Xác thực Google không hợp lệ',
        },
      });
    }
  }
  

async verifyForgotToken(req, res, next) {
  try {
    const { token } = req.body;
    // Tìm token trong bảng otp_tokens, trường otp
    const existedToken = await Otp.findOne({ where: { otp: token } });
    if (!existedToken) {
      throw new ErrorResponse(404, 'Token không tồn tại');
    }
    return new ApiResponse(res, {
      status: 200,
      message: 'Xác thực thành công'
    });
  } catch (err) {
    next(err);
  }
}


async resetPasswords(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    console.log(`Nhận yêu cầu khôi phục mật khẩu với mã xác nhận: ${token}`);

    // Tìm OTP tương ứng
    const otpRecord = await Otp.findOne({ where: { otp: token } });
    console.log(`Kết quả tìm kiếm mã xác nhận: ${otpRecord}`);

    if (!otpRecord) {
      throw new ErrorResponse(400, 'Mã xác nhận không hợp lệ hoặc đã hết hạn');
    }

    // Nếu muốn kiểm tra hết hạn, bạn có thể so sánh created_at + 1h
    const expiredTime = new Date(otpRecord.created_at);
    expiredTime.setHours(expiredTime.getHours() + 1);
    if (expiredTime < new Date()) {
      throw new ErrorResponse(400, 'Mã xác nhận đã hết hạn');
    }

    const user = await User.findOne({ where: { email: otpRecord.email } });
    console.log(`Kết quả tìm kiếm người dùng: ${user}`);

    if (!user) {
      throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống');
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUND));
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Xóa OTP sau khi dùng
    await Otp.destroy({ where: { otp: token } });

    console.log('Mật khẩu đã được cập nhật thành công.');

    return res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
  } catch (err) {
    console.error('Lỗi trong resetPassword:', err);
    next(err);
  }
}


async resendForgotToken(req, res, next) {
  try {
    const { email } = req.body;
    // Xóa mã OTP cũ nếu có
    await Otp.destroy({ where: { email } });

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống');
    }

    // Tạo mã OTP mới
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    await Otp.create({
      email,
      otp: code,
      created_at: new Date()
    });

    const message = `Mã xác nhận của bạn là: ${code}. Mã này sẽ hết hạn sau 1 giờ.`;

    await EmailService.sendMail(
      user.email,
      "Mã xác nhận khôi phục mật khẩu",
      `<p>${message}</p>`
    );

    return new ApiResponse(res, {
      status: 200,
      message: 'Vui lòng kiểm tra email để khôi phục mật khẩu'
    });
  } catch (err) {
    next(err);
  }
}

}

module.exports = new AuthController()

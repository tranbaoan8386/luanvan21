const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Role = require('../models/Role')
const ErrorResponse = require('../response/ErrorResponse')
const ApiResponse = require('../response/ApiResponse')
const generateOtp = require('../utils/generateOtp')
const RegisterOtp = require('../models/mongo/RegisterOtp')
const EmailService = require('../services/EmailService')
const ForgotToken = require('../models/mongo/ForgotToken')
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
    
            // Băm mật khẩu với salt 10 rounds
            //
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


    async verifyOtp(req, res, next) {
        try {
            const { otp, email } = req.body

            const user = await RegisterOtp.findOne({ email })
            if (!user) {
                throw new ErrorResponse(404, 'Mã xác thực không tồn tại hoặc đã hết hạn')
            }
            if (user.otp !== otp) {
                throw new ErrorResponse(401, 'Mã xác thực không đúng')
            }

            await Promise.all([
                User.update(
                    {
                        verified: true
                    },
                    {
                        where: {
                            email
                        }
                    }
                ),
                RegisterOtp.deleteOne({ email })
            ])

            return new ApiResponse(res, {
                status: 200,
                message: 'Xác thực thành công'
            })
        } catch (err) {
            next(err)
        }
    }

    async resendOtp(req, res, next) {
    try {
        const { email } = req.body;
        console.log('[resendOtp] Email nhận:', email);

        // Xoá mã cũ nếu có
        const deleteResult = await RegisterOtp.deleteOne({ email });
        console.log('[resendOtp] Kết quả xoá OTP cũ:', deleteResult);

        // Tạo mã mới
        const otp = generateOtp();
        console.log('[resendOtp] Mã OTP mới:', otp);

        const registerOtp = new RegisterOtp({ email, otp });

        // Lưu vào DB và gửi mail song song
        const [savedOtp, mailResult] = await Promise.all([
        registerOtp.save(),
        EmailService.sendMail({
            to: email,
            subject: 'Yêu cầu gửi lại mã xác thực',
            html: `Mã xác thực mới của bạn là: <b>${otp}</b>`
        })
        ]);

        console.log('[resendOtp] Đã lưu OTP:', savedOtp);
        console.log('[resendOtp] Kết quả gửi email:', mailResult);

        return new ApiResponse(res, {
        status: 200,
        message: 'Gửi lại mã xác thực thành công'
        });
    } catch (err) {
        console.error('[resendOtp] Lỗi:', err);
        next(err);
    }
    }


    async forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    console.log(`Kết quả tìm kiếm người dùng: ${user}`);

    if (!user) {
      throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống');
    }

    // Nếu đã tồn tại token → xóa đi để tạo mới
    const existedToken = await ForgotToken.findOne({ email });
    console.log(`Kết quả kiểm tra token hiện tại: ${existedToken}`);

    if (existedToken) {
      await ForgotToken.deleteOne({ email }); //XÓA token cũ
      console.log('Đã xóa token cũ để tạo mới.');
    }

    // Tạo mã xác nhận gồm 4 chữ số
    const code = Math.floor(1000 + Math.random() * 9000);
    console.log(`Mã xác nhận đã tạo: ${code}`);

    const forgotToken = new ForgotToken({
      email,
      token: code,
      expires: Date.now() + 3600000 // 1 giờ
    });

    const message = `Mã xác nhận của bạn là: ${code}. Mã này sẽ hết hạn sau 1 giờ.`;
    console.log(`Thông báo khôi phục mật khẩu: ${message}`);

    await forgotToken.save();

    await EmailService.sendMail(user.email, "Mã xác nhận khôi phục mật khẩu", `<p>${message}</p>`);

    console.log('Email đã được gửi và mã xác nhận đã được lưu thành công.');

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
            const { token } = req.body
            const existedToken = await ForgotToken.findOne({ token })
            if (!existedToken) {
                throw new ErrorResponse(404, 'Token không tồn tại')
            }
            return new ApiResponse(res, {
                status: 200,
                message: 'Xác thực thành công'
            })
        } catch (err) {
            next(err)
        }
    }

    async resetPasswords(req, res, next) {
        try {
            const { token, newPassword } = req.body;
            console.log(`Nhận yêu cầu khôi phục mật khẩu với mã xác nhận: ${token}`);

            // Tìm kiếm mã xác nhận trong cơ sở dữ liệu
            const forgotToken = await ForgotToken.findOne({ token });
            console.log(`Kết quả tìm kiếm mã xác nhận: ${forgotToken}`);

            if (!forgotToken) {
                throw new ErrorResponse(400, 'Mã xác nhận không hợp lệ hoặc đã hết hạn');
            }

            if (forgotToken.expires < Date.now()) {
                throw new ErrorResponse(400, 'Mã xác nhận đã hết hạn');
            }

            const user = await User.findOne({ where: { email: forgotToken.email } });
            console.log(`Kết quả tìm kiếm người dùng: ${user}`);

            if (!user) {
                throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống');
            }

            // Mã xác nhận hợp lệ, cập nhật mật khẩu mới
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUND));
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            user.password = hashedPassword;
            await user.save();

            // Xóa mã xác nhận sau khi sử dụng
            await ForgotToken.deleteOne({ token });

            console.log('Mật khẩu đã được cập nhật thành công.');

            return res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
        } catch (err) {
            console.error('Lỗi trong resetPassword:', err);
            next(err);
        }
    }

    async resendForgotToken(req, res, next) {
        try {
            const { email } = req.body
            await ForgotToken.deleteOne({ email })

            const user = await User.findOne({
                where: { email }
            })
            if (!user) {
                throw new ErrorResponse(404, 'Người dùng không tồn tại trong hệ thống')
            }

            // Tạo token
            const token = randomBytes(32)
            const forgotToken = new ForgotToken({
                email,
                token
            })

            const link = `${env.CLIENT_URL}/forgot-password/${token}`

            await Promise.all([
                forgotToken.save()
                // Gửi email
                // EmailService.sendMail({
                //     to: email,
                //     subject: 'Yêu cầu quên mật khẩu',
                //     html: `<h1> CLick <a href="${link}">Here</a> to reset password!</h1>`
                // })
            ])

            return new ApiResponse(res, {
                status: 200,
                message: 'Vui lòng kiểm tra email để khôi phục mật khẩu'
            })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AuthController()

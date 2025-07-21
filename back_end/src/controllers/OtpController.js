const { Otp, User } = require('../models');
const { generateOtp } = require('../utils/generateOtp');
// const sendMail = require('../utils/sendMail');

class OtpController {
  // [POST] /api/v1/otp/send
  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Email là bắt buộc.' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
      }

      const code = generateOtp();
      const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút sau

      // Nếu đã tồn tại OTP cho email này thì cập nhật
      const [otpRecord, created] = await Otp.findOrCreate({
        where: { email },
        defaults: { code, expiredAt }
      });

      if (!created) {
        otpRecord.code = code;
        otpRecord.expiredAt = expiredAt;
        await otpRecord.save();
      }

      // Gửi mail
      await sendMail(email, 'Mã xác thực OTP của bạn', `Mã OTP: ${code}`);

      return res.status(200).json({ message: 'OTP đã được gửi đến email.' });
    } catch (error) {
      next(error);
    }
  }

  // [POST] /api/v1/otp/verify
  async verifyOtp(req, res, next) {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ message: 'Email và mã OTP là bắt buộc.' });
      }

      const otpRecord = await Otp.findOne({ where: { email } });
      if (!otpRecord) {
        return res.status(400).json({ message: 'Không tìm thấy OTP cho email này.' });
      }

      if (otpRecord.code !== code) {
        return res.status(400).json({ message: 'Mã OTP không chính xác.' });
      }

      if (new Date() > otpRecord.expiredAt) {
        return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
      }

      // Xác thực thành công
      await otpRecord.destroy(); // Xóa OTP sau khi xác thực
      return res.status(200).json({ message: 'Xác thực OTP thành công.' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OtpController();

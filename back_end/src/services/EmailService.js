const nodemailer = require('nodemailer')
const maiConfig = require('../config/mail.config');
const mailConfig = require('../config/mail.config');
require('dotenv').config();
exports.sendMail = (to, subject, htmlContent) => {
  const transport = nodemailer.createTransport({
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    secure: mailConfig.SECURITY,
    auth: {
      user: mailConfig.USERNAME, // Gmail gửi đi (ví dụ: quanghuy110303@gmail.com)
      pass: mailConfig.PASSWORD  // Mật khẩu ứng dụng
    }
  });

  const options = {
    from: mailConfig.FROM_ADDRESS, // Người gửi (thường giống với USERNAME)
    to: to,                         // Người nhận (email người dùng)
    subject: subject,              // Tiêu đề email
    html: htmlContent              // Nội dung HTML (chứa mã OTP, thông báo, v.v.)
  };

  return transport.sendMail(options);
};


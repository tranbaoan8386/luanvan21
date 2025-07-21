const express = require('express');
const router = express.Router();
const OtpController = require('../controllers/OtpController');

// Gửi OTP
router.post('/send', OtpController.sendOtp);

// Xác minh OTP
router.post('/verify', OtpController.verifyOtp);

module.exports = router;

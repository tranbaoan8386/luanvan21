const generateOtp = () => {
    // Tạo một số ngẫu nhiên từ 10000 đến 99999 (có 5 chữ số)
    return Math.floor(10000 + Math.random() * 90000)
}

module.exports = generateOtp

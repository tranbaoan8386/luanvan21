const multer = require('multer');
const path = require('path');
const { env } = require('../config/env');

const mimeTypes = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/jpg': '.jpg',
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        let ext = mimeTypes[file.mimetype];

        // Nếu mimeType không có đuôi phù hợp, fallback bằng extname từ tên gốc
        if (!ext) {
            ext = path.extname(file.originalname) || '.jpg';
        }

        const uniqueName = `${Date.now()}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (!ext.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Chỉ hỗ trợ định dạng .jpg, .jpeg, .png'), false);
    }
    cb(null, true);
};

const limits = {
    fileSize: env.FILE_LIMIT * 1024 * 1024,
};

const uploadMiddleware = multer({ storage, fileFilter, limits });

module.exports = uploadMiddleware;

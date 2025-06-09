const User = require('../models/User');
const Role = require('../models/Role');

const authorizedMiddleware = (...roles) => {
    return async (req, res, next) => {
        try {
            const { id: userId } = req.user;

            // ❌ Sai: thiếu include -> user.role sẽ là undefined
            // const user = await User.findByPk(userId);

            // ✅ Đúng: include Role để lấy user.role.name
            const user = await User.findByPk(userId, {
                include: [{ model: Role, as: 'role' }]
            });

            console.log("🔍 USER:", user?.toJSON?.());
            console.log("🔐 Required roles:", roles);

            const userRoleName = user?.role?.name;

            if (!user || !roles.includes(userRoleName)) {
                console.warn("⚠️ Không có quyền:", userRoleName);
                return res.status(403).json({ error: "Bạn không có quyền" });
            }

            req.user.role = userRoleName; // nếu bạn cần dùng sau
            next();
        } catch (err) {
            console.error("❌ Lỗi authorizedMiddleware:", err.message);
            res.status(500).json({ error: "Lỗi phân quyền" });
        }
    };
};

module.exports = authorizedMiddleware;

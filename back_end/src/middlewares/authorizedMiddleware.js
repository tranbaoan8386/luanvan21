const User = require('../models/User');
const Role = require('../models/Role');

const authorizedMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const { id: userId } = req.user;

      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: 'role' }],
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 USER:', user?.toJSON?.());
        console.log('🔐 Required roles:', roles);
      }

      if (!user || !user.role) {
        return res.status(403).json({ error: 'Không thể xác định vai trò người dùng' });
      }

      const userRoleName = user.role.name;

      if (!roles.includes(userRoleName)) {
        console.warn('⚠️ Không có quyền:', userRoleName);
        return res.status(403).json({ error: 'Bạn không có quyền thực hiện chức năng này' });
      }

      req.user.role = userRoleName;
      next();
    } catch (err) {
      console.error('❌ Lỗi authorizedMiddleware:', err.message);
      return res.status(500).json({ error: 'Lỗi phân quyền hệ thống' });
    }
  };
};

module.exports = authorizedMiddleware;

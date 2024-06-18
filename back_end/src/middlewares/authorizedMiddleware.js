const Role = require('../models/Role')
const User = require('../models/User')
const ErrorResponse = require('../response/ErrorResponse')

const authorizedMiddleware = (...roles) => {
    return async (req, res, next) => {
        try {
            const { id: userId } = req.user
            const user = await User.findByPk(userId)

            if (!user || !roles.includes(user.role)) {
                throw new ErrorResponse(403, 'Bạn không có quyền')
            }
            req.user.role = user.role
            next()
        } catch (err) {
            next(err)
        }
    }
}

module.exports = authorizedMiddleware

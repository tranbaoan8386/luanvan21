const jwt = require('jsonwebtoken')
const { env } = require('../config/env')
const ApiResponse = require('../response/ApiResponse')

const jwtAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // throw new ErrorResponse(401, 'Không được phép')
        return ApiResponse.error(res, {
            status: 401,
            data: {
                message: 'Không được phép'
            }
        })
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        return ApiResponse.error(res, {
            status: 401,
            data: {
                message: 'Không được phép'
            }
        })
    }

    try {
        const user = jwt.verify(token, env.SECRET_KEY)
        req.user = user
    } catch (err) {
        return ApiResponse.error(res, {
            status: 401,
            data: {
                message: 'Không được phép '
            }
        })
    }
    next()
}

module.exports = jwtAuthMiddleware

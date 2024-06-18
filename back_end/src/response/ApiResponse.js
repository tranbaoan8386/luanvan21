class ApiResponse {
    constructor(res, { status = 200, message = null, data = null }) {
        const responseObj = {
            success: true
        }
        if (message !== null) {
            responseObj.message = message
        }

        if (data !== null) {
            responseObj.data = data
        }

        res.status(status).json(responseObj)
    }

    static error(res, { status = 400, message = null, data = null }) {
        const responseObj = {
            success: false
        }
        if (message !== null) {
            responseObj.message = message
        }

        if (data !== null) {
            responseObj.data = data
        }

        res.status(status).json(responseObj)
    }
    static success(res, { status = 200, message = null, data = null }) {
        const responseObj = {
            success: true
        }
        if (message !== null) {
            responseObj.message = message
        }

        if (data !== null) {
            responseObj.data = data
        }

        res.status(status).json(responseObj)
    }
}
module.exports = ApiResponse

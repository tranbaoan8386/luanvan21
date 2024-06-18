class ErrorResponse {
    constructor(status, { data }) {
        this.status = status
        this.data = data
    }
}

module.exports = ErrorResponse

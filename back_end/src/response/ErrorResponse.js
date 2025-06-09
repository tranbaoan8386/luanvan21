// class ErrorResponse {
//     constructor(status, { data }) {
//         this.status = status
//         this.data = data
//     }
// }

// module.exports = ErrorResponse
class ErrorResponse extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;

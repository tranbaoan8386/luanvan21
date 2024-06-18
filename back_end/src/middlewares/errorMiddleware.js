const errorMiddleware = (err, req, res, next) => {
    // console.log(JSON.stringify(err, null, 2));
    const { code, message } = err

    res.status(typeof code === 'number' ? code : 500).json({
        success: false,
        message: message || 'Internal Error.'
    })
}

module.exports = errorMiddleware

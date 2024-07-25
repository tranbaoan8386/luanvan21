const express = require('express')
const router = express.Router()
const { env } = require('../config/env')
router.get(
    '/config', (req, res) => {
        return res.status(200).json({
            status: 'ok',
            data: env.CLIENT_ID
        });
    }

)
module.exports = router

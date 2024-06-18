const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const handleRouters = require('./routes')
const errorMiddleware = require('./middlewares/errorMiddleware')
const { env } = require('./config/env')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const uploadsDirectory = path.join(__dirname, 'uploads')
app.use('/uploads', express.static(uploadsDirectory))
require('./models/relationship')
// Connect database
require('./database')

// Router
handleRouters(app)

// Error handlers middleware
app.use(errorMiddleware)

app.listen(env.PORT, () => {
    console.log(`Example app listening on port ${env.PORT}`)
})

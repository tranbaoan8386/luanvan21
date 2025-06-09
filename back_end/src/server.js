require('dotenv').config(); // ⬅️ PHẢI đặt ở dòng đầu tiên

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const handleRouters = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
const uploadsDirectory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));


// Relationship + DB
require('./models/relationship');
require('./database');

// Router + Error
handleRouters(app);
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

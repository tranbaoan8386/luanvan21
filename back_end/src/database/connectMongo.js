const mongoose = require('mongoose');

const connectMongo = async () => {
    try {
        await mongoose.connect(`mongodb+srv://vole:16072002@cluster0.86vityx.mongodb.net/`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        throw error; // Rethrow the error to handle it in connectToMongo()
    }
}

module.exports = connectMongo;

const connectToMongo = async () => {
    try {
        await connectMongo();
        console.log('Connected mongo successfully!');
    } catch (err) {
        console.log('Failed to connect mongo:', err.message);
    }
}

connectToMongo();

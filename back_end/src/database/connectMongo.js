/* const mongoose = require('mongoose');

const connectMongo = async () => {
    const uri = process.env.MONGODB_URI;

    try {
        await mongoose.connect(uri); // ✅ Không cần thêm option
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
    }
};

module.exports = connectMongo;
 */
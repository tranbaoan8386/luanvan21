const sequelize = require('./connectMysql');
const connectMongo = require('./connectMongo');

const connectToMysql = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to MySQL');
    } catch (err) {
        console.error('❌ Failed to connect to MySQL:', err.message);
    }
};

const connectToMongo = async () => {
    try {
        await connectMongo();
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err.message);
    }
};

const connectDatabases = async () => {
    await connectToMysql();
    await connectToMongo();
};

connectDatabases();

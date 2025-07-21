const sequelize = require('./connectMysql');

const connectToMysql = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to MySQL');
    } catch (err) {
        console.error('❌ Failed to connect to MySQL:', err.message);
    }
};

const connectDatabases = async () => {
    await connectToMysql();
};

connectDatabases();

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Create MySQL connection pool with SSL support for cloud databases
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'staffoods',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 20000, // 20 seconds
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection error:', err.message);
        console.error('📋 Connection details:');
        console.error(`   Host: ${process.env.DB_HOST}`);
        console.error(`   Port: ${process.env.DB_PORT || 3306}`);
        console.error(`   User: ${process.env.DB_USER}`);
        console.error(`   Database: ${process.env.DB_NAME}`);
        console.error('\n💡 Troubleshooting tips:');
        console.error('   1. Check if database credentials are correct in .env');
        console.error('   2. Verify database server is running and accessible');
        console.error('   3. Check firewall/security group settings');
        console.error('   4. For cloud databases, ensure SSL is enabled (DB_SSL=true)');
        console.error('   5. Verify your IP is whitelisted in cloud database settings');
    });

export default pool;

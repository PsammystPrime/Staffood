const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL connection pool with SSL support for cloud databases
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'staffoods',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000, // 20 seconds
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL Database connected successfully');
        // console.log(`📍 Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
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

module.exports = pool;

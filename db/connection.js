const mysql = require('mysql2/promise'); 

async function connectToDatabase() {
    const connection = await mysql.createConnection({ 
        host: 'localhost',
        user: 'bradleytroll', // Replace with your actual username
        password: 'passwordnode ', // Replace with your actual password
        database: 'your_database_name' // Complete your database name
    });
    return connection;
}

module.exports = connectToDatabase;

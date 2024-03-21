const mysql = require('mysql2/promise');


const config = {
  host: 'localhost',   
  user: 'root', // Your database username
  password: '', // Your database password
  database: 'employeetracker_db' // Your database name
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(config);
    console.log('Successfully connected to the database.');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error; // Rethrow or handle error as needed
  }
}

module.exports = connectToDatabase;


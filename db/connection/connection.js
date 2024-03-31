const mysql = require('mysql2');


const config = {
  host: 'localhost',   
  user: 'root', // Your database username
  password: 'password', // Your database password
  database: 'employeetracker_db' // Your database name
};

function connectToDatabase() {
  try {
    const connection = mysql.createConnection(config);
    connection.connect(error => {
      if (error) throw error;
      console.log('Successfully connected to the database.');
    });
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error; 
  }
}

module.exports = connectToDatabase;


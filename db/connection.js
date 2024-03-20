const mysql = require('mysq12')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name'
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
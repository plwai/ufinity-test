const mysql = require('mysql');
const dbConfig = require('../../config/db-config');

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error(`error: ${err.message}`);
  }
});

module.exports = connection;

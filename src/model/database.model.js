const mysql = require('mysql');

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }

  connect() {
    return new Promise((resolve, _reject) => {
      this.connection.connect(err => {
        if (err) {
          throw new Error(`error: ${err.message}`);
        }

        resolve();
      });
    });
  }

  query(sql, args) {
    return new Promise((resolve, _reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          throw new Error(err);
        }

        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, _reject) => {
      this.connection.end(err => {
        if (err) {
          throw new Error(err);
        }
        resolve();
      });
    });
  }
}

module.exports = Database;

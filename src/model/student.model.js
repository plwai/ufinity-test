const db = require('./dbconnection');

const student = {
  getAllStudent: () => {},
  getStudent: email => {
    const params = [];
    params.push(email);

    return new Promise((resolve, _reject) => {
      db.query(
        'SELECT * FROM student WHERE email=?',
        params,
        (err, _result, _field) => {
          if (err) {
            throw new Error(err);
          }

          resolve(_result);
        }
      );
    });
  },
  registerStudent: email => {
    const params = [];
    params.push(email);

    return new Promise((resolve, _reject) => {
      db.query(
        'INSERT INTO student (email) VALUES(?)',
        params,
        (err, _result, _field) => {
          if (err) {
            throw new Error(err);
          }

          resolve(_result);
        }
      );
    });
  },
};

module.exports = student;

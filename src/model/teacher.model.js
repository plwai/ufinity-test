const db = require('./dbconnection');

const Teacher = {
  getAllTeacher: () => {},
  getTeacher: email => {
    const params = [];
    params.push(email);

    return new Promise((resolve, _reject) => {
      db.query(
        'SELECT * FROM teacher WHERE email=?',
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
  registerTeacher: email => {
    const params = [];
    params.push(email);

    return new Promise((resolve, _reject) => {
      db.query(
        'INSERT INTO teacher (email) VALUES(?)',
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

module.exports = Teacher;

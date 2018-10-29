const db = require('./dbconnection');

const student = {
  getAllStudent: () => {},
  getStudent: email => {
    const params = [];
    params.push(email);

    return db.query('SELECT * FROM student WHERE email=?', params);
  },
  registerStudent: email => {
    const params = [];
    params.push(email);

    return db.query('INSERT INTO student (email) VALUES(?)', params);
  },
};

module.exports = student;

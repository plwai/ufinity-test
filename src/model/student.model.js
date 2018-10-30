const db = require('./dbconnection');

const student = {
  getStudent: email => {
    const params = [];
    params.push(email);

    return db.query('SELECT * FROM student WHERE email=?', params);
  },
  getStudentById: id => {
    const params = [];
    params.push(id);

    return db.query('SELECT * FROM student WHERE studentId=?', params);
  },
  registerStudent: email => {
    const params = [];
    params.push(email);

    return db.query('INSERT INTO student (email) VALUES(?)', params);
  },
};

module.exports = student;

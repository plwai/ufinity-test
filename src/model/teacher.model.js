const db = require('./dbconnection');

const Teacher = {
  getTeacher: email => {
    const params = [];
    params.push(email);

    return db.query('SELECT * FROM teacher WHERE email=?', params);
  },
  registerTeacher: email => {
    const params = [];
    params.push(email);

    return db.query('INSERT INTO teacher (email) VALUES(?)', params);
  },
};

module.exports = Teacher;

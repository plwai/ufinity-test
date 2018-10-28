const mysql = require('mysql');
const dbConfig = require('../../config/db-config');

const seedConnection = mysql.createConnection(dbConfig);

seedConnection.connect(err => {
  if (err) {
    console.error(`error: ${err.message}`);
  }

  const createDB = {
    createTeacher: `create table if not exists teacher(
      teacherId int PRIMARY KEY auto_increament,
      email VARCHAR(255)not null)`,
    createStudent: `create table if not exists student(
      studentId int PRIMARY KEY auto_increament,
      email VARCHAR(255)not null,
      isSuspended bit not null DEFAULT 1)`,
    createTeacherClass: `create table if not exists teacherClass(
      id int PRIMARY KEY auto_increment,
      FOREIGN KEY (teacherId) REFERENCES teacher(teacherId),
      FOREIGN KEY (studentId) REFERENCES student(studentId),
    )`,
  };

  // eslint-disable-next-line no-unused-vars
  seedConnection.query(createDB.createTeacher, (queryErr, result, field) => {
    if (queryErr) {
      console.log(queryErr.meesage);
    }
  });

  // eslint-disable-next-line no-unused-vars
  seedConnection.query(createDB.createStudent, (queryErr, result, field) => {
    if (queryErr) {
      console.log(queryErr.meesage);
    }
  });

  // eslint-disable-next-line no-unused-vars
  seedConnection.query(createDB.createClass, (queryErr, result, field) => {
    if (queryErr) {
      console.log(queryErr.meesage);
    }
  });

  seedConnection.end(endErr => {
    if (endErr) {
      console.log(err.message);
    }
  });
});

module.exports = seedConnection;

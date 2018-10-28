const mysql = require('mysql');
const dbConfig = require('./config/db-config');

const createDB = `create database if not exists ${
  dbConfig.database === undefined ? 'ufinity' : dbConfig.database
}`;

const createTable = {
  createTeacher: `create table if not exists teacher(
    teacherId int PRIMARY KEY auto_increment,
    email VARCHAR(255)not null)`,
  createStudent: `create table if not exists student(
    studentId int PRIMARY KEY auto_increment,
    email VARCHAR(255)not null,
    isSuspended bit not null DEFAULT 1)`,
  createTeacherClass: `create table if not exists teacherClass(
    classId int PRIMARY KEY auto_increment,
    teacherId int,
    studentId int,
    FOREIGN KEY (teacherId) REFERENCES teacher(teacherId),
    FOREIGN KEY (studentId) REFERENCES student(studentId)
  )`,
};

const seedConnection = mysql.createConnection(dbConfig);

const seedDb = () =>
  seedConnection.connect(err => {
    if (err) {
      throw new Error(`error: ${err.stack}`);
    }

    // Create db
    seedConnection.query(createDB, (queryErr, _result, _field) => {
      if (queryErr) {
        throw new Error(queryErr);
      }
    });

    // Use db
    seedConnection.query(
      `use ${dbConfig.database === undefined ? 'ufinity' : dbConfig.database}`,
      (queryErr, _result, _field) => {
        if (queryErr) {
          throw new Error(queryErr);
        }
      }
    );

    // Create teacher table
    seedConnection.query(
      createTable.createTeacher,
      (queryErr, _result, _field) => {
        if (queryErr) {
          throw new Error(queryErr.message);
        }
      }
    );

    // Create student table
    seedConnection.query(
      createTable.createStudent,
      (queryErr, _result, _field) => {
        if (queryErr) {
          throw new Error(queryErr.message);
        }
      }
    );

    // Create class table
    seedConnection.query(
      createTable.createTeacherClass,
      (queryErr, _result, _field) => {
        if (queryErr) {
          throw new Error(queryErr.message);
        }
      }
    );

    // End connection
    seedConnection.end(endErr => {
      if (endErr) {
        throw new Error(err.message);
      }
    });
  });

seedDb();

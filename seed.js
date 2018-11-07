const Database = require('./src/model/database.model');
const dbConfig = require('./config/db-config');

const databaseName = dbConfig.database;

const createDB = `CREATE DATABASE if not exists ${databaseName}`;

const createTable = {
  createTeacher: `CREATE TABLE if not exists teacher(
    teacherId int PRIMARY KEY auto_increment,
    email VARCHAR(255)not null,
    UNIQUE (email)
  )`,
  createStudent: `CREATE TABLE if not exists student(
    studentId int PRIMARY KEY auto_increment,
    email VARCHAR(255)not null,
    isSuspended tinyint not null DEFAULT 0,
    UNIQUE (email)
  )`,
  createTeacherClass: `CREATE TABLE if not exists teacherclass(
    classId int PRIMARY KEY auto_increment,
    teacherId int,
    studentId int,
    FOREIGN KEY (teacherId) REFERENCES teacher(teacherId),
    FOREIGN KEY (studentId) REFERENCES student(studentId)
  )`,
};

const seedDb = db =>
  new Promise(async (resolve, _reject) => {
    await db.connect();
    await db.query(createDB);
    await db.query(`use ${databaseName}`);
    await db.query(createTable.createTeacher);
    await db.query(createTable.createStudent);
    await db.query(createTable.createTeacherClass);
    await db.close();

    resolve();
  });

module.exports.initDb = async () => {
  // Remove connection database name
  dbConfig.database = undefined;

  const db = new Database(dbConfig);
  await seedDb(db);

  // Revert database name
  dbConfig.database = databaseName;
};

require('make-runnable');

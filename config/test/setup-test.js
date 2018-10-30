const Database = require('../../src/model/database.model');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  insecureAuth: true,
};

const createDB = `CREATE DATABASE if not exists ${
  dbConfig.database === undefined ? 'ufinityplwaitest' : dbConfig.database
}`;

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
    await db.query(createDB);
    await db.query('use ufinityplwaitest');
    await db.query(createTable.createTeacher);
    await db.query(createTable.createStudent);
    await db.query(createTable.createTeacherClass);

    resolve();
  });

module.exports = async () => {
  const db = new Database(dbConfig);

  await db.connect();
  await seedDb(db);
  await db.close();
};

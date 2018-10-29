const Database = require('../../src/model/database.model');

const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  insecureAuth: true,
};

const dropDBQuery = 'DROP DATABASE ufinityplwaitest';

const dropDB = () =>
  new Promise(async (resolve, _reject) => {
    const db = new Database(dbConfig);

    await db.connect();
    await db.query(dropDBQuery);
    await db.close();

    resolve();
  });

module.exports = async () => {
  await dropDB();
};

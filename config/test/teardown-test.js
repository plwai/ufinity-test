const Database = require('../../src/model/database.model');
const dbConfig = require('../../config/db-config');

const dropDBQuery = `DROP DATABASE ${dbConfig.database}`;

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

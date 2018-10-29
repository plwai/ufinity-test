const dbConfig = require('../../config/db-config');
const Database = require('./database.model');

const db = new Database(dbConfig);
db.connect();

module.exports = db;

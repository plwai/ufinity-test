const seed = require('../../seed').initDb;

module.exports = async () => {
  await seed();
};

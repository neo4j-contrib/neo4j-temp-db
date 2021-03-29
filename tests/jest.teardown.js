module.exports = async function () {
  require('dotenv').config();
  var c = require('../src/console.js');
  await c.cleanAllDatabases();
  await c.neo4j_system_driver.close();
};

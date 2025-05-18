const { knex } = require('knex');
require('dotenv').config();

const databaseConfig = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 7 }
};

const databaseConnection = knex(databaseConfig);

module.exports = databaseConnection;

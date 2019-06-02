// this code in NOT in use, all schema/model is embedded in connector mysqlDB.js itself
// ****** Set up default MYSQL connection START ****** //
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  operatorsAliases: false,
  pool: { max: 5,min: 0, acquire: 30000, idle: 10000 }
});
const Schema = sequelize.Schema;

sequelize.authenticate().then(() => { console.log('conneted to MYSQL- database');})
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// ****** Set up default MYSQL connection END ****** //

const User = sequelize.define('user', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
  workerID: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
});

module.exports = { User }

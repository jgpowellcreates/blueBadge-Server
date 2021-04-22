const {Sequelize} = require('sequelize'); //import Sequelize constructor
const db = new Sequelize(process.env.DB_CONNECTION_STRING); //sets up connection to PGadmin database

module.exports = db;
const {Sequelize} = require('sequelize'); //import Sequelize constructor
const db = new Sequelize({/* <connect_to_postgres> */}); //sets up connection to PGadmin database

module.exports = db;
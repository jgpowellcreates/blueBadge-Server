const {Sequelize} = require('sequelize'); //import Sequelize constructor
const db = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    ssl: process.env.ENVIRONMENT === 'production'
}); //sets up connection to PGadmin database

module.exports = db;
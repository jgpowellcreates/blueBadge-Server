const { DataTypes } = require("sequelize"); //
const db = require ("../db");

const Store = db.define("store", {
    storeName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    storeLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    storeDescription: {
        type: DataTypes.STRING,
    }
})

module.exports = Store;
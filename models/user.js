const { DataTypes } = require("sequelize"); //
const db = require ("../db");

const User = db.define("user", {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shoppingCartContents: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
});


module.exports = User;
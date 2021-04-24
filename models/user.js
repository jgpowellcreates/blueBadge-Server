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
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    } ,
    shoppingCartContents: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
    //},
   // storeID - let this be foreign key created by new store endpoint
    }
});

module.exports = User;
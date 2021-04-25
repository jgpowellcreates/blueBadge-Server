const { DataTypes } = require("sequelize"); //
const db = require ("../db");

const Product = db.define("product", {
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imageURL: {
        type: DataTypes.STRING,
    }
});

module.exports = Product;
const db = require("../db");
const UserModel = require("./user");
const StoreModel = require("./store");
const ProductModel = require("./product");

module.exports = {
    dbConnection: db,
    UserModel,
    StoreModel,
    ProductModel
};

StoreModel.belongsTo(UserModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
UserModel.hasOne(StoreModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});

ProductModel.belongsTo(StoreModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
StoreModel.hasMany(ProductModel, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
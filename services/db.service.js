const fs = require('fs');
const { Sequelize } = require('sequelize');
const getDynamicPath = require('../utils/getDirPath.util');
const dotenv = require('dotenv')
dotenv.config({ path: '.env' });

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: "mysql",

    define: {
        timestamps: true,
    },

    query: {
        raw: true,
    },
    logging: false,

    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
  
const db = {};
db.connect = sequelize;
db.Sequelize = Sequelize;

// DYNAMIC MODEL REQUIRE
const rootPath = getDynamicPath(1);
const modelDir = `${rootPath}/models`;
const requirePath = "../models/";

const files = fs.readdirSync(modelDir);

files.forEach((file) => {
    const tableName = file.split(".")[0];
    const importPath = `${requirePath}/${file}`;
    db[tableName] = require(importPath)(sequelize, Sequelize);
});

// ASSOCIATIONS

/**
 * business and address -> one to many
 * Ref: Businesses.business_id < Addresses.business_id
 */

// db.business.hasMany(db.address, {
//     foreignKey: {
//         name: "business_id",
//         onDelete: "CASCADE",
//     },
// });

// db.address.belongsTo(db.business, {
//     foreignKey: {
//         name: "business_id",
//         onDelete: "CASCADE",
//     },
// });

/**
 * business and business department -> one to many
 * Businesses.business_id < BusinessDepartments.business_id
 */
// db.business.hasMany(db.business_department, {
//     foreignKey: {
//         name: "business_id",
//         onDelete: "CASCADE",
//     },
// });

// db.business_department.belongsTo(db.business, {
//     foreignKey: {
//         name: "business_id",
//         onDelete: "CASCADE",
//     },
// });

/**
 * business department and business member -> one to many
 * Ref: BusinessDepartments.business_id < BusinessMember.department
 */

module.exports = db;
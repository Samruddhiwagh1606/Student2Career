const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
});

console.log("DATABASE:", process.env.DB_NAME);
console.log("DB HOST:", process.env.DB_HOST);
console.log("DB USER:", process.env.DB_USER);

module.exports = db;
const mysql = require('mysql');
const util = require('util');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const keyPath = path.join(__dirname, 'authentication.json');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  keyFilename: keyPath
});

// Promisify the query method
db.query = util.promisify(db.query);

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Database connected....');
});

module.exports = db;

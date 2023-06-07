const mysql = require('mysql');
const util = require('util');
const path = require('path');

const keyPath = path.join(__dirname, 'config', 'authentication.json');

const db = mysql.createConnection({
  host: '34.173.105.246',
  user: 'root',
  password: 'beraktakcebok',
  database: 'cineu',
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

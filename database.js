const mysql = require('mysql');
const path = require('path');

const keyPath = path.join(__dirname, 'config', 'authentication.json');

const db = mysql.createConnection({
    host     : '34.173.105.246',
    user     : 'root',
    password : 'beraktakcebok',
    database : 'cineu',
    keyFilename: keyPath
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('database connected....')
});
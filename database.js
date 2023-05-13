const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'beraktakcebok',
    database : 'cineu'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('database connected....')
});
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'movieapp'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('database connected....')
});
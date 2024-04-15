const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password: 'Arhab2004$',
    database : 'Blog_db'
})

db.connect((err)=>{
    if(err)
    {
        console.log(err)
    }else{
        console.log('connected to database')
    }
})

module.exports = db
    const mysql = require('mysql2'); // Or require('mysql2');

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'leopard',
        password: 'HeyDojo',
        database: 'notepadApp'
    });
    
    
    
   


    module.exports = connection;
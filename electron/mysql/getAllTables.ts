// Get the client
import mysql from 'mysql2/promise';

export const getAllTables = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'test',
        port: 3306
    });

    try {
        const [results, fields] = await connection.query(
          'SHOW TABLES'
        );
      
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
    }
}
// Get the client
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
// Create the connection to database
const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
});

export default connection;

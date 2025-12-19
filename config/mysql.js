// Get the client
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// 1. On détermine le fichier à charger en fonction de NODE_ENV
// Si NODE_ENV n'est pas défini, on utilise .env.dev par défaut
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

// 2. On configure dotenv avec le bon chemin
dotenv.config({ path: envFile });
// Create the connection to database
const connection = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

try {
    await connection.ping();
    console.log('Connected to the database successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
export default connection;

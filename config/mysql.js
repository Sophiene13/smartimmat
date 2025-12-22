import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Chargement de la config
dotenv.config();
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

// createPool au lieu de createConnection
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // On autorise jusqu'à 10 connexions simultanées
  queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL Database via Pool');
        connection.release(); // IMPORTANT : On relâche la connexion pour la rendre disponible
    })
    .catch(err => {
        console.error('Database Connection Failed:', err.message);
    });

export default pool;
import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import customerRoutes from './src/routes/customerRoutes.js';
import './config/mysql.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 3000

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/customers', customerRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Route introuvable' });
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoute.js';
import './config/mysql.js';

const app = express()
const port = 3000

app.use(express.json());
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

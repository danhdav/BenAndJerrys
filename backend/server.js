// app.js
import express from 'express';
import connection from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import employeeRouter from './routes/employeesRoute.js';
import productRouter from './routes/productsRoute.js';
import orderRouter from './routes/ordersRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3000; // Port for the server
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/employees', employeeRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// Test database connection
connection.query('SHOW TABLES', (err, results) => {
  if (err) {
    console.error('Database connection failed:', err);
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
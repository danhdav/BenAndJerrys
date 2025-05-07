import { createConnection } from 'mysql2';

const connection = createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // or your MAMP password
  database: 'new_schema', // should be whatever you named your DB
  port: 3306
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

export default connection;
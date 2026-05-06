const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'portfolio_builder',
});

db.connect((err) => {
  if (err) {
    console.error(' Database connection failed:', err);
    return;
  }
  console.log(' MySQL Connected');
});

module.exports = db;
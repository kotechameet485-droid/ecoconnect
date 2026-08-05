/* ===================================================
   EcoConnect Database Connection Module (db.js)
   Supports MySQL (mysql2) and PostgreSQL (pg)
   Normalizes query responses to { rows: [...] }
   =================================================== */

require('dotenv').config();

const dbDriver = (process.env.DB_DRIVER || 'mysql').toLowerCase();

let pool;
let isMySQL = false;

if (dbDriver === 'pg' || dbDriver === 'postgres' || dbDriver === 'postgresql') {
  const { Pool } = require('pg');
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'ecoconnect',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL Database:', process.env.DB_NAME || 'ecoconnect');
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message);
  });
} else {
  isMySQL = true;
  const mysql = require('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_NAME || 'ecoconnect',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

/**
 * Unified Query Wrapper
 * Translates PostgreSQL $1, $2 parameters to MySQL ? placeholders if using MySQL,
 * and normalizes output format to { rows: [...] } for maximum compatibility.
 */
const query = async (text, params = []) => {
  if (!isMySQL) {
    return pool.query(text, params);
  }

  // Handle health check query SELECT NOW() -> SELECT NOW() AS now
  let mysqlSql = text;
  if (mysqlSql.trim().toUpperCase() === 'SELECT NOW()') {
    mysqlSql = 'SELECT NOW() AS now';
  }

  // Convert $1, $2, $3 to ? for MySQL
  mysqlSql = mysqlSql.replace(/\$\d+/g, '?');

  // Handle RETURNING clause in INSERT/UPDATE for MySQL compatibility
  const returningMatch = mysqlSql.match(/RETURNING\s+(.*)/i);
  mysqlSql = mysqlSql.replace(/RETURNING\s+.*$/i, '').trim();

  const [results] = await pool.query(mysqlSql, params);

  // If query was an INSERT and returning clause was requested, fetch inserted row
  if (results && results.insertId && returningMatch) {
    const tableNameMatch = text.match(/INSERT\s+INTO\s+([^\s(]+)/i);
    if (tableNameMatch) {
      const tableName = tableNameMatch[1];
      const [insertedRows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [results.insertId]);
      return { rows: insertedRows };
    }
  }

  // If results is array (SELECT queries)
  if (Array.isArray(results)) {
    return { rows: results };
  }

  return { rows: results ? [results] : [] };
};

module.exports = {
  query,
  pool,
};

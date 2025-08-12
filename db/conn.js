const { Pool } = require('pg');
const connectionString = process.env.POSTGRES_PRISMA_URL;
const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
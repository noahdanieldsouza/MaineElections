const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Example: get total deaths
async function getTotalDeaths() {
    const result = await pool.query(`
      SELECT DISTINCT cty FROM election_results_2024_president 
      WHERE cty IS NOT NULL 
      LIMIT 1;
    `);
    return result.rows[0]?.cty; // returns just the string 'SOM'
  }

// Export more queries here as needed
module.exports = {
  getTotalDeaths,
};

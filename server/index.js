const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/deaths', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT SUM(total_deaths)::int AS total_deaths
       FROM coviddeaths
       WHERE location = 'Bosnia and Herzegovina';`
    );
    res.json({ total: result.rows[0].total_deaths });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

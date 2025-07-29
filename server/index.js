const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const { getTotalDeaths } = require('./db/queries');

const app = express();
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/data', async (req, res) => {
  try {
    const cty = await getTotalDeaths();
    console.log(cty)
    res.json(cty );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Query failed' });
  }
});

app.get('/2024-pres', async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT 
  TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', '')) AS municipality,
  SUM(democratic) AS democrat_votes,
  SUM(republican) AS republican_votes,
  SUM(tbc) - SUM(republican) - SUM(democratic) AS other
FROM election_results_2024_president
WHERE municipality IS NOT NULL AND cty IS NOT NULL
GROUP BY TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', ''));
      `);
      console.log(result.rows)
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  app.get('/2024-sen', async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT 
  TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', '')) AS municipality,
  SUM(democratic) AS democrat_votes,
  SUM(republican) AS republican_votes,
  SUM(tbc) - SUM(republican) - SUM(democratic) AS other
FROM election_results_2024_sen
WHERE municipality IS NOT NULL AND cty IS NOT NULL

GROUP BY TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', ''));
      `);
      console.log(result.rows)
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  app.get('/2024-statesen', async (req, res) => {
    try {
      const result = await pool.query(`
      SELECT 
  TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', '')) AS municipality,
  SUM(democratic) AS democrat_votes,
  SUM(republican) AS republican_votes,
  SUM(tbc) - SUM(republican) - SUM(democratic) AS other
FROM election_results_2024_statesen
WHERE municipality IS NOT NULL AND cty IS NOT NULL
GROUP BY TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', ''));
      `);
      console.log(result.rows)
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

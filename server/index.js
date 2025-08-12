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

app.get('/:year/:type', async (req, res) => {
  const { year, type } = req.params;


  const tableName = `election_results_${year}_${type}`;
  try {
    const result = await pool.query(`
    SELECT 
TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', '')) AS municipality,
SUM(democratic) AS democrat_votes,
SUM(republican) AS republican_votes,
SUM(tbc) - SUM(republican) - SUM(democratic) AS other
FROM ${tableName}
WHERE municipality IS NOT NULL AND cty IS NOT NULL
GROUP BY TRIM(REPLACE(REPLACE(municipality, 'Twp', ''), 'twp', ''));
    `);
   
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/:yearFrom/:typeFrom/:comparison/:yearTo/:typeTo', async (req, res) => {
  const { yearFrom, typeFrom, comparison, yearTo, typeTo } = req.params;



const tableNameFrom = `election_results_${yearFrom}_${typeFrom.toLowerCase()}`;
const tableNameTo = `election_results_${yearTo}_${typeTo.toLowerCase()}`;

console.log(`
FROM ${tableNameFrom} f
JOIN ${tableNameTo} t
`);

  try {
    const result = await pool.query(`
    SELECT 
  TRIM(REPLACE(REPLACE(f.municipality, 'Twp', ''), 'twp', '')) AS municipality,
  SUM(f.democratic) AS from_democrat_votes,
  SUM(f.republican) AS from_republican_votes,
  SUM(t.democratic) AS to_democrat_votes,
  SUM(t.republican) AS to_republican_votes,
  SUM(f.tbc) - SUM(f.republican) - SUM(f.democratic) AS from_other,
  SUM(t.democratic) - SUM(f.democratic) AS dem_difference,
  SUM(t.republican) - SUM(f.republican) AS rep_difference,
  SUM(t.tbc) - SUM(t.republican) - SUM(t.democratic) AS to_other
FROM ${tableNameFrom} f
JOIN ${tableNameTo} t
  ON t.municipality = f.municipality
  AND f.cty = t.cty
WHERE f.municipality IS NOT NULL AND f.cty IS NOT NULL
GROUP BY TRIM(REPLACE(REPLACE(f.municipality, 'Twp', ''), 'twp', ''));

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

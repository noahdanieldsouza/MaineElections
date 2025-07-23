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

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

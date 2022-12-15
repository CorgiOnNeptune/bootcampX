require('dotenv').config();
const env = process.env;

const { Pool } = require('pg');

const pool = new Pool({
  user: env.USER,
  password: env.PASS,
  host: env.HOST,
  database: env.NAME,
  port: env.PORT || 8001
});

// Our (devs) input that we know we have control over
const queryString = `
  SELECT students.id as student_id, students.name as name, cohorts.name as cohort
  FROM students
  JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  LIMIT $2;
  `;

// User input that could be malicious
const cohortName = process.argv[2];
const limit = process.argv[3] || 5;
const values = [`%${cohortName}%`, limit];


// Paramaterized query, safe from SQL injection
pool.query(queryString, values)
  .then(res => {
    res.rows.forEach(row => {
      console.log(`${row.name} has an id of ${row.student_id} and was in the ${row.cohort} cohort.`);
    })
  })
  .catch(err => console.error('query error', err.stack));
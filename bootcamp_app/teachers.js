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

const queryString = `
  SELECT DISTINCT teachers.name AS teacher,
    cohorts.name AS cohort
  FROM assistance_requests
    JOIN teachers ON teachers.id = teacher_id
    JOIN students ON students.id = student_id
    JOIN cohorts ON cohorts.id = cohort_id
  WHERE cohorts.name LIKE $1
  ORDER BY teacher;
  `;

const cohortName = process.argv[2] || 'JUL02';
const values = [`%${cohortName}%`];

pool.query(queryString, values)
  .then(res => {
    res.rows.forEach(row => {
      console.log(`${row.cohort}: ${row.teacher}`);
    })
  })
  .catch(err => console.error('query error', err.stack));
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

const args = process.argv;

pool.query(`
SELECT students.id AS student_id, students.name, cohorts.name AS cohort
FROM students
JOIN cohorts ON cohorts.id = cohort_id
WHERE cohorts.name LIKE '%${args[2]}%'
LIMIT ${args[3] || 5};
`)
  .then(res => {
    res.rows.forEach(user => {
      console.log(`${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort.`);
    })
  })
  .catch(err => console.error('query error', err.stack));
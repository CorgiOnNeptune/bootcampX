SELECT cohorts.name AS cohort_name,
  COUNT(students.*) AS student_count
FROM cohorts
  JOIN students on cohorts.id = cohort_id
GROUP BY cohort_name
HAVING COUNT(students.*) >= 18
ORDER BY student_count,
  cohort_name;
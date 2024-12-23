// src/utils/dbHelper.js
import pool from "../config/db.js";


export async function findMatchingJobs(position) {
  const result = await pool.query(
    `SELECT * FROM "jobPostings" 
     WHERE LOWER("jobTitle") LIKE LOWER($1)
     AND CURRENT_DATE <= "applicationEndDate"`,
    [`%${position}%`]
  );
  return result.rows;
}

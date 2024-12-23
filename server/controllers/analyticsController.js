import pool from "../config/db.js";

// Number of Applications Added Monthly
export const monthlyApplication = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT 
              TO_CHAR("applicationDate", 'YYYY-MM') AS month, 
              COUNT(*) AS total
          FROM applications
          GROUP BY TO_CHAR("applicationDate", 'YYYY-MM')
          ORDER BY month;
      `);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
}

// Top Job Postings by Applications
export const jobPostingVsApplication = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT 
              j."jobTitle", 
              COUNT(a."applicationId") AS t
          FROM "jobPostings" j
          LEFT JOIN applications a ON j."jobPostingId" = a."jobPostingId"
          GROUP BY j."jobTitle"
          ORDER BY t DESC
          LIMIT 10;
      `);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
}


// Number of Job Postings Added Monthly
export const jobPostingsVsMonth = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT 
              TO_CHAR("postingDate", 'YYYY-MM') AS month, 
              COUNT(*) AS total
          FROM "jobPostings"
          GROUP BY TO_CHAR("postingDate", 'YYYY-MM')
          ORDER BY month;
      `);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
}

// Application Status Breakdown
export const statusApplicationBreakdown =  async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                "applicationStatus", 
                COUNT(*) AS total
            FROM applications
            GROUP BY "applicationStatus"
            ORDER BY "applicationStatus";
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


import pool from "../config/db.js";

export const getCandidates = async (req, res) => {
  try {
//     const query = `SELECT 
//     c.*, 
//     COUNT(a."applicationId") AS count, 
//     COALESCE(JSON_AGG(a) FILTER (WHERE a."applicationId" IS NOT NULL), '[]') AS applications
//     FROM 
//         candidates c
//     LEFT JOIN 
//         applications a
//     ON 
//         c."candidateId"  = a."candidateId" 
//     GROUP BY 
//         c."candidateId" ;
// `;

      const query = `
        SELECT 
          c.*, 
          COUNT(a."applicationId") AS count,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'applicationId', a."applicationId",
                'applicationDate', a."applicationDate",
                'applicationStatus', a."applicationStatus",
                'resumeScore', a."resumeScore",
                'jobTitle', j."jobTitle",
                'jobPosition', j."jobPosition",
                'location', j."location"
              ) 
              ORDER BY a."applicationDate" DESC
            ) FILTER (WHERE a."applicationId" IS NOT NULL), 
            '[]'
          ) AS applications
        FROM 
          candidates c
        LEFT JOIN 
          applications a ON c."candidateId" = a."candidateId"
        LEFT JOIN
          "jobPostings" j ON a."jobPostingId" = j."jobPostingId"
        GROUP BY 
          c."candidateId";
      `;

    const result = await pool.query(query);
    //processing...

    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error in getCandidates:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch candidates",
      error: error.message,
    });
  }
};

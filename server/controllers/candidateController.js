import pool from "../config/db.js";

export const getCandidates = async (req, res) => {
  try {
    const query = `SELECT 
    c.*, 
    COUNT(a."applicationId") AS count, 
    COALESCE(JSON_AGG(a) FILTER (WHERE a."applicationId" IS NOT NULL), '[]') AS applications
    FROM 
        candidates c
    LEFT JOIN 
        applications a
    ON 
        c."candidateId"  = a."candidateId" 
    GROUP BY 
        c."candidateId" ;
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

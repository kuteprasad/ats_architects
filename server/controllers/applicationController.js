import pool from "../config/db.js";

export const getApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const query = `
      SELECT 
        a."applicationId",
        a."applicationDate",
        a."resume",
        a."resumeScore",
        c."firstName",
        c."lastName",
        c."email"
      FROM applications a
      JOIN candidates c ON a."candidateId" = c."candidateId"
      WHERE a."jobPostingId" = $1
      ORDER BY a."resumeScore" DESC NULLS LAST;
    `;

    const result = await pool.query(query, [jobId]);

    console.log("res ", result.rows);

    const formattedApplications = result.rows.map((app) => ({
      applicationId: app.applicationId,
      candidateName: `${app.firstName} ${app.lastName}`,
      email: app.email,
      applicationDate: app.applicationDate.toISOString(),
      resumeScore: app.resumeScore,
      resume: app.resume, // BLOB data
    }));

    console.log("formated ", formattedApplications);

    res.status(200).json({
      success: true,
      applications: formattedApplications,
    });
  } catch (error) {
    console.error("Error in getApplicationsByJobId:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body;
    const resume = req.file;
    

    console.log("jobId ", jobId);
    console.log("boday ", req.body);

    if (!firstName || !lastName || !email || !phoneNumber || !resume) {
      return res.status(400).json({
        success: false,
        message: "All fields and resume are required",
      });
    }

    // Check if candidate exists
    const checkCandidateQuery = `
      SELECT "candidateId" 
      FROM "candidates" 
      WHERE "email" = $1
    `;

    let candidateResult = await pool.query(checkCandidateQuery, [email]);
    let candidateId;
    // console.log("candidate id if already exists: ", candidateResult.rows[0]);

    if (candidateResult.rows.length > 0) {
      // Use existing candidate
      candidateId = candidateResult.rows[0].candidateId;
      console.log("candidate id if already exists: ", candidateId);
    } else {
      // Create new candidate
      const createCandidateQuery = `
        INSERT INTO "candidates" (
          "firstName", 
          "lastName", 
          "email", 
          "phoneNumber"
        )
        VALUES ($1, $2, $3, $4)
        RETURNING "candidateId"
      `;

      candidateResult = await pool.query(createCandidateQuery, [
        firstName,
        lastName,
        email,
        phoneNumber,
      ]);
      candidateId = candidateResult.rows[0].candidateId;
  
      console.log("candidate id if new: ", candidateId);
    }

    // console.log("cd 1", candidateId);

    // Create application
    const insertQuery = `
  INSERT INTO applications (
    "jobPostingId",
    "candidateId",
    "applicationDate",
    "applicationStatus",
    "resume"
  )
  VALUES ($1, $2, CURRENT_TIMESTAMP, 'PENDING', $3);
`;

    const selectQuery = `
  SELECT "jobTitle"
  FROM "jobPostings"
  WHERE "jobPostingId" = $1;
`;

    // Execute the queries in sequence
    await pool.query(insertQuery, [jobId, candidateId, resume.buffer]);
    const result = await pool.query(selectQuery, [jobId]);
    const jobTitle = result.rows[0].jobTitle;

    // console.log("Job Title:", jobTitle);
    console.log("result of create Application: ", result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        candidateName: `${firstName} ${lastName}`,
        jobTitle,
        email
      },
    });
  } catch (error) {
    console.error("Error in createApplication:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

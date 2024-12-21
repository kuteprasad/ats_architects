import pool from '../config/db.js';

export const getApplicationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const query = `
      SELECT 
        a.applicationId,
        a.applicationDate,
        a.resume,
        a.resumeScore,
        c.firstName,
        c.lastName,
        c.email
      FROM applications a
      JOIN candidates c ON a.candidateId = c.candidateId
      WHERE a.jobPostingId = $1
      ORDER BY a.resumeScore DESC
    `;

    const result = await pool.query(query, [jobId]);

    const formattedApplications = result.rows.map(app => ({
      applicationId: app.applicationId,
      candidateName: `${app.firstName} ${app.lastName}`,
      email: app.email,
      applicationDate: app.applicationDate.toISOString(),
      resumeScore: app.resumeScore,
      resume: app.resume // BLOB data
    }));

    res.status(200).json({
      success: true,
      applications: formattedApplications
    });

  } catch (error) {
    console.error('Error in getApplicationsByJobId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body;
    const resume = req.file;

    console.log("boday ",  req.body);

    if (!firstName || !lastName || !email || !phoneNumber || !resume) {
      return res.status(400).json({
        success: false,
        message: 'All fields and resume are required'
      });
    }

    // Check if candidate exists
    const checkCandidateQuery = `
      SELECT candidateId 
      FROM candidates 
      WHERE email = $1
    `;
    
    let candidateResult = await pool.query(checkCandidateQuery, [email]);
    let candidateId;

    if (candidateResult.rows.length > 0) {
      // Use existing candidate
      candidateId = candidateResult.rows[0].candidateId;
    } else {
      // Create new candidate
      const createCandidateQuery = `
        INSERT INTO candidates (
          firstName, 
          lastName, 
          email, 
          phoneNumber
        )
        VALUES ($1, $2, $3, $4)
        RETURNING candidateId
      `;

      candidateResult = await pool.query(createCandidateQuery, [
        firstName,
        lastName,
        email,
        phoneNumber
      ]);
      candidateId = candidateResult.rows[0].candidateId;
    }

    // Create application
    const applicationQuery = `
      INSERT INTO applications (
        jobPostingId,
        candidateId,
        applicationDate,
        applicationStatus,
        resume,
        resumeScore
      )
      VALUES ($1, $2, CURRENT_TIMESTAMP, 'PENDING', $3, NULL)
      RETURNING *
    `;

    const applicationResult = await pool.query(applicationQuery, [
      jobId,
      candidateId,
      resume.buffer
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: applicationResult.rows[0]
    });

  } catch (error) {
    console.error('Error in createApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};
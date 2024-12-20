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
    const { candidateId, resume } = req.body;

    const query = `
      INSERT INTO applications (jobPostingId, candidateId, resume)
      VALUES ($1, $2, $3)
      RETURNING applicationId
    `;

    const result = await pool.query(query, [jobId, candidateId, resume]);

    res.status(201).json({
      success: true,
      applicationId: result.rows[0].applicationId
    });

  } catch (error) {
    console.error('Error in createApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create application',
      error: error.message
    });
  }
};
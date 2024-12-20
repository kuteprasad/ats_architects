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

    if (!candidateId || !resume) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID and resume are required'
      });
    }

    const query = `
      INSERT INTO applications (
        jobPostingId, 
        candidateId, 
        applicationDate,
        applicationStatus,
        resume,
        resumeScore,
        interviewSchedule
      )
      VALUES (
        $1, $2, 
        CURRENT_TIMESTAMP, 
        'PENDING',
        $3,
        NULL,
        NULL
      )
      RETURNING *
    `;

    const result = await pool.query(query, [jobId, candidateId, resume]);

    res.status(201).json({
      success: true,
      application: {
        applicationId: result.rows[0].applicationId,
        jobPostingId: result.rows[0].jobPostingId,
        candidateId: result.rows[0].candidateId,
        applicationDate: result.rows[0].applicationDate,
        applicationStatus: result.rows[0].applicationStatus,
        resumeScore: result.rows[0].resumeScore
      }
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
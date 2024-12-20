import pool from '../config/db.js';

export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      location,
      salaryRange,
      jobPosition,
      applicationEndDate,
      jobRequirements
    } = req.body;

    // Validate required fields
    if (!jobTitle || !jobDescription || !location || !jobPosition || !applicationEndDate || !jobRequirements) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    const query = `
      INSERT INTO jobPostings (
        jobTitle,
        jobDescription,
        location,
        salaryRange,
        jobPosition,
        postingDate,
        applicationEndDate,
        jobRequirements
      ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7)
      RETURNING *
    `;

    const values = [
      jobTitle,
      jobDescription,
      location,
      salaryRange || null,
      jobPosition,
      applicationEndDate,
      jobRequirements
    ];

    const result = await pool.query(query, values);
    const createdJob = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job: createdJob
    });

  } catch (error) {
    console.error('Error in createJob:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job posting',
      error: error.message
    });
  }
};
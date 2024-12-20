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

export const fetchJobs = async (req, res) => {
  try {
    const query = `
      SELECT 
        jobPostingId,
        jobTitle,
        jobDescription,
        location,
        salaryRange,
        jobPosition,
        postingDate,
        applicationEndDate,
        jobRequirements
      FROM jobPostings
      ORDER BY postingDate DESC
    `;

    const result = await pool.query(query);

    // Format dates and return jobs
    const formattedJobs = result.rows.map(job => ({
      ...job,
      postingDate: job.postingDate.toISOString(),
      applicationEndDate: job.applicationEndDate
    }));

    res.status(200).json({
      success: true,
      jobs: formattedJobs
    });

  } catch (error) {
    console.error('Error in fetchJobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job postings',
      error: error.message
    });
  }
};
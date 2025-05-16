import pool from "../config/db.js";

export const fetchInterviewsByInterviewerId = async (req, res) => {
  try {
    const { interviewerId } = req.params;

    console.log("interviewid: ", interviewerId);

    const query = `
        SELECT 
          i."interviewId",
          i."applicationId",
          i."jobPostingId",
          i."interviewerId",
          c."firstName" || ' ' || c."lastName" as "candidateName",
          c."email" as "candidateEmail",
          jp."jobTitle",
          i."interviewDate",
          i."interviewStartTime",
          i."interviewEndTime",
          a."applicationStatus" as "status",
          i."comments",
          i."joinUrl",
          i."meetingId",
          a."resume",
          i."communicationScore",
          i."technicalScore",
          i."experienceScore",
          i."problemSolvingScore",
          i."culturalFitScore",
          i."timeManagementScore",
          i."overallScore",
          i."cumulativeScore"
        FROM "interviews" i
        JOIN "applications" a ON i."applicationId" = a."applicationId"
        JOIN "candidates" c ON a."candidateId" = c."candidateId"
        JOIN "jobPostings" jp ON i."jobPostingId" = jp."jobPostingId"
        WHERE i."interviewerId" = $1
        ORDER BY i."interviewDate" ASC, i."interviewStartTime" ASC
      `;

    const result = await pool.query(query, [interviewerId]);

    const interviews = result.rows.map((interview) => ({
      interviewId: interview.interviewId,
      applicationId: interview.applicationId,
      jobPostingId: interview.jobPostingId,
      interviewerId: interview.interviewerId,
      candidateName: interview.candidateName,
      candidateEmail: interview.candidateEmail,
      jobTitle: interview.jobTitle,
      interviewDate: interview.interviewDate,
      interviewStartTime: interview.interviewStartTime,
      interviewEndTime: interview.interviewEndTime,
      status: interview.status,
      comments: interview.comments,
      joinUrl: interview.joinUrl,
      meetingId: interview.meetingId,
      resume: interview.resume,
      scores: {
        communicationScore: interview.communicationScore || 0,
        technicalScore: interview.technicalScore || 0,
        experienceScore: interview.experienceScore || 0,
        problemSolvingScore: interview.problemSolvingScore || 0,
        culturalFitScore: interview.culturalFitScore || 0,
        timeManagementScore: interview.timeManagementScore || 0,
        overallScore: interview.overallScore || 0,
        cumulativeScore: interview.cumulativeScore || 0,
      },
    }));

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
      error: error.message,
    });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const {
      interviewId,
      communicationScore,
      technicalScore,
      experienceScore,
      problemSolvingScore,
      culturalFitScore,
      timeManagementScore,
      overallScore,
      cumulativeScore,
      comments,
    } = req.body;

    const query = `
        UPDATE "interviews"
        SET
          "communicationScore" = $1,
          "technicalScore" = $2,
          "experienceScore" = $3,
          "problemSolvingScore" = $4,
          "culturalFitScore" = $5,
          "timeManagementScore" = $6,
          "overallScore" = $7,
          "cumulativeScore" = $8,
          "comments" = $9
        WHERE "interviewId" = $10
        RETURNING *
      `;

    const result = await pool.query(query, [
      communicationScore,
      technicalScore,
      experienceScore,
      problemSolvingScore,
      culturalFitScore,
      timeManagementScore,
      overallScore,
      cumulativeScore,
      comments,
      interviewId,
    ]);

    res.status(200).json({
      success: true,
      message: "Feedback added successfully",
      interview: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add feedback",
      error: error.message,
    });
  }
};

export const addSchedules = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { schedules } = req.body;

    const checkQuery = 
 `SELECT * FROM "interviews"
 WHERE "applicationId" = $1
 AND "jobPostingId" = $2
 AND "interviewerId" = $3`
 ;

    const insertQuery = `
        WITH inserted_interview AS (
          INSERT INTO "interviews" (
            "applicationId", "jobPostingId", "interviewerId", 
            "interviewDate", "interviewStartTime", "interviewEndTime", 
            "joinUrl", "meetingId"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        )
        SELECT
  i.*,
  CONCAT(c."firstName", ' ', c."lastName") as "candidateName",
  c."email" as "candidateEmail",
  j."jobTitle"
FROM inserted_interview i
JOIN "applications" a ON i."applicationId" = a."applicationId"
JOIN "candidates" c ON a."candidateId" = c."candidateId"
JOIN "jobPostings" j ON i."jobPostingId" = j."jobPostingId"`;

    const savedInterviews = [];
    const duplicates = [];

    for (const schedule of schedules) {
      // Check if interview already exists
      const existingInterview = await client.query(checkQuery, [
        schedule.applicationId,
        schedule.jobPostingId,
        schedule.interviewerId,
      ]);

      if (existingInterview.rows.length > 0) {
        duplicates.push({
          applicationId: schedule.applicationId,
          jobPostingId: schedule.jobPostingId,
          interviewerId: schedule.interviewerId,
        });
        continue;
      }

      const startDateTime = new Date(schedule.startDateTime);
      const endDateTime = new Date(schedule.endDateTime);

      const values = [
        schedule.applicationId,
        schedule.jobPostingId,
        schedule.interviewerId,
        startDateTime.toISOString().split("T")[0],
        startDateTime.toTimeString().split(" ")[0],
        endDateTime.toTimeString().split(" ")[0],
        schedule.joinUrl,
        schedule.meetingId,
      ];

      const result = await client.query(insertQuery, values);
      savedInterviews.push(result.rows[0]);
    }

    await client.query("COMMIT");

    console.log("Saved interviews:", savedInterviews);
    console.log("Duplicate interviews:", duplicates);

    res.status(201).json({
      success: true,
      message: "Schedules added successfully",
      schedules: savedInterviews,
      duplicates: duplicates,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating interviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create interviews",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const changeApplicationStatusToAccepted = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const query = `
      UPDATE "applications"
      SET "applicationStatus" = 'Accepted'
      WHERE "applicationId" = $1
      RETURNING *
    `;

    const result = await pool.query(query, [applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application status updated to Accepted",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

export const changeApplicationStatusToRejected = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const query = `
      UPDATE "applications"
      SET "applicationStatus" = 'Rejected'
      WHERE "applicationId" = $1
      RETURNING *
    `;

    const result = await pool.query(query, [applicationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application status updated to Rejected",
      application: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

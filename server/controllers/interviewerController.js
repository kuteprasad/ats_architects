import pool from "../config/db.js";

export const fetchInterviewsByInterviewerId = async (req, res) => {
    try {
      const { interviewerId } = req.params;
  
      const query = `
        SELECT 
          i."interviewId",
          i."applicationId",
          i."jobPostingId",
          i."interviewerId",
          a."firstName" || ' ' || a."lastName" as "candidateName",
          a."email" as "candidateEmail",
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
        JOIN "jobPostings" jp ON i."jobPostingId" = jp."jobPostingId"
        WHERE i."interviewerId" = $1
        ORDER BY i."interviewDate" ASC, i."interviewStartTime" ASC
      `;
  
      const result = await pool.query(query, [interviewerId]);
  
      const interviews = result.rows.map(interview => ({
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
          cumulativeScore: interview.cumulativeScore || 0
        }
      }));
  
      res.status(200).json({
        success: true,
        interviews
      });
  
    } catch (error) {
      console.error('Error fetching interviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch interviews',
        error: error.message
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
        comments
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
        interviewId
      ]);
  
      res.status(200).json({
        success: true,
        message: 'Feedback added successfully',
        interview: result.rows[0]
      });
  
    } catch (error) {
      console.error('Error adding feedback:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add feedback',
        error: error.message
      });
    }
  }
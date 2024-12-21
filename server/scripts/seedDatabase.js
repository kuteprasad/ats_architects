import pool from "../config/db.js";

export const deleteTables = async () => {
  const query = `
    DROP TABLE IF EXISTS "jobPostings" CASCADE;
    DROP TABLE IF EXISTS "candidates" CASCADE;
    DROP TABLE IF EXISTS "users" CASCADE;
    DROP TABLE IF EXISTS "applications" CASCADE;
    DROP TABLE IF EXISTS "interview" CASCADE;
  `;
  try {
    await pool.query(query);
    console.log("Tables deleted successfully");
  } catch (err) {
    console.error("Error deleting tables:", err);
  }
};

export const createTables = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS "candidates"(
      "candidateId" SERIAL PRIMARY KEY,
      "firstName" VARCHAR(100),
      "lastName" VARCHAR(100),
      "email" VARCHAR(255) UNIQUE,
      "phoneNumber" VARCHAR(10)
    );
    CREATE TABLE IF NOT EXISTS "users" (
      "userId" SERIAL PRIMARY KEY,
      "firstName" VARCHAR(50) NOT NULL,
      "lastName" VARCHAR(50) NOT NULL,
      "email" email NOT NULL UNIQUE,
      "password" VARCHAR(255) NOT NULL,
      "role" VARCHAR(50) NOT NULL CHECK ("role" IN ('admin', 'interviewer', 'HR'))
    );
    CREATE TABLE IF NOT EXISTS "jobPostings" (
      "jobPostingId" SERIAL PRIMARY KEY,
      "jobTitle" VARCHAR(255),
      "jobDescription" TEXT,
      "location" TEXT,
      "salaryRange" VARCHAR(50),
      "jobPosition" VARCHAR(50),
      "postingDate" DATE DEFAULT CURRENT_DATE,
      "applicationEndDate" DATE,
      "jobRequirements" TEXT
    );
    CREATE TABLE IF NOT EXISTS "applications" (
      "applicationId" SERIAL PRIMARY KEY,
      "candidateId" INT REFERENCES "candidates"("candidateId"),
      "jobPostingId" INT REFERENCES "jobPostings"("jobPostingId"),
      "applicationDate" DATE DEFAULT CURRENT_DATE,
      "applicationStatus" VARCHAR(50),
      "resume" BYTEA DEFAULT NULL,
      "interviewSchedule" DATE DEFAULT NULL,
      "resumeScore" DECIMAL(5, 2) DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS "interviews" (
      "interviewId" SERIAL PRIMARY KEY,
      "candidateId" INT REFERENCES "candidates"("candidateId"),
      "jobPostingId" INT REFERENCES "jobPostings"("jobPostingId"),
      "interviewerId" INT REFERENCES "users"("userId"),
      "interviewDate" DATE,
      "interviewType" VARCHAR(50),
      "interviewResult" VARCHAR(50),
      "feedback" TEXT
    );
    CREATE TABLE IF NOT EXISTS "notification" (
      "notificationId" SERIAL PRIMARY KEY,
      "recipientId" INT,
      "type" VARCHAR(50),
      "messageContent" TEXT,
      "dateSent" TIMESTAMP,
      "notificationStatus" VARCHAR(50)
    );
  `;
  try {
    await pool.query(query);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

export const insertValues = async () => {
  const query = `
    INSERT INTO "candidates" ("firstName", "lastName", "email", "phoneNumber")
    VALUES 
      ('Pranav', 'Londhe', 'pranav@.com', '1234567890'),
      ('Shraddha', 'Mali', 'shraddha@.com', '0987654321'),
      ('Prasad', 'Kute', 'prasad@.com', '1122334455');

    INSERT INTO "users" ("firstName", "lastName", "email", "password", "role")
    VALUES 
      ('Admin', 'User', 'admin@.com', '1234', 'admin'),
      ('Interviewer', 'One', 'interviewer@.com', '1234', 'interviewer'),
      ('HR', 'Manager', 'hrmanager@.com', '1234', 'HR');

    INSERT INTO "jobPostings" ("jobTitle", "jobDescription", "location", "salaryRange", "jobPosition", "postingDate", "applicationEndDate", "jobRequirements")
    VALUES 
      ('Software Engineer', 'Develop and maintain software applications.', 'Bangalore, India', '1000000-1200000', 'Full-time', CURRENT_DATE, '2023-12-31', 'BSc in Computer Science, 2+ years experience'),
      ('Product Manager', 'Manage product development and strategy.', 'Mumbai, India', '1200000-1400000', 'Full-time', CURRENT_DATE, '2023-12-31', 'MBA, 3+ years experience');

    INSERT INTO "applications" ("candidateId", "jobPostingId", "applicationDate", "applicationStatus", "resumeScore")
    VALUES 
      (1, 1, CURRENT_DATE, 'Pending', 0),
      (2, 2, CURRENT_DATE, 'Pending', 0),
      (3, 1, CURRENT_DATE, 'Pending', 0);

    INSERT INTO "interview" ("candidateId", "jobPostingId", "interviewerId", "interviewDate", "interviewType", "interviewResult", "feedback")
    VALUES 
      (1, 1, 2, CURRENT_DATE, 'Technical', 'Pending', 'Good technical skills'),
      (2, 2, 3, CURRENT_DATE, 'HR', 'Pending', 'Good communication skills'),
      (3, 1, 2, CURRENT_DATE, 'Technical', 'Pending', 'Strong problem-solving skills');
  `;
  try {
    await pool.query(query);
    console.log("Hardcoded values inserted successfully");
  } catch (err) {
    console.error("Error inserting hardcoded values:", err);
  }
};

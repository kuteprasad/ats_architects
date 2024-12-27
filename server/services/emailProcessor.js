// src/services/emailProcessor.js
import { getGoogleServices } from "./googleServices.js";
import { findMatchingJobs } from "../utils/dbHelper.js";
import {
  extractJobDetails,
  analyzeResume,
  isJobEmail,
} from "../utils/geminiHelper.js";
import { createApplication } from "../controllers/applicationController.js"; 
import pool from "../config/db.js"; // Import the database connection pool
import pdfParse from 'pdf-parse'; // Library to extract text from PDF

function findAttachmentPart(payload) {
  if (!payload.parts) {
    // Check if the payload itself is an attachment
    if (
      payload.body &&
      payload.body.attachmentId &&
      isValidFileType(payload.mimeType)
    ) {
      return payload;
    }
    return null;
  }

  // Search through all parts
  for (const part of payload.parts) {
    if (part.body && part.body.attachmentId && isValidFileType(part.mimeType)) {
      return part;
    }
    // If this part has sub-parts, search them too
    if (part.parts) {
      const foundPart = findAttachmentPart(part);
      if (foundPart) return foundPart;
    }
  }
  return null;
}

// Function to extract text from the PDF
async function extractTextFromPdf(resumeBuffer) {
  try {
    const data = await pdfParse(resumeBuffer);
    return data.text;  // Extracted text from the PDF
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return null;
  }
}

// Utility helper to validate the file mime type
function isValidFileType(mimeType) {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return validTypes.includes(mimeType);
  }

  export async function processIncomingEmail() {
    const client = await pool.connect();
    
    try {
      const { gmail } = await getGoogleServices();
  
      // Fetch unread emails
      const response = await gmail.users.messages.list({
        userId: "primusindus@gmail.com",
        q: "is:unread has:attachment",
        maxResults: 10,
      });
  
      if (!response.data.messages) {
        return {
          success: true,
          message: 'No unread emails found',
          processed: 0,
          skipped: 0
        };
      }
  
      let processedCount = 0;
      let skippedCount = 0;
      const processingResults = [];
  
      for (const message of response.data.messages) {
        try {
          // Fetch full message details
          const fullMessage = await gmail.users.messages.get({
            userId: "primusindus@gmail.com",
            id: message.id,
          });
  
          // Extract email data
          const headers = fullMessage.data.payload.headers;
          const subject = headers.find((h) => h.name === "Subject")?.value || "";
          const from = headers.find((h) => h.name === "From")?.value || "";
  
          // Check if email is job-related using Gemini
          const emailContent = fullMessage.data.snippet || "";
          const isJobRelated = await isJobEmail(subject, emailContent);
  
          if (!isJobRelated) {
            console.log(`Skipping non-job email: ${subject}`);
            skippedCount++;
            continue;
          }
  
          // Find the attachment part
          const attachmentPart = findAttachmentPart(fullMessage.data.payload);
  
          if (!attachmentPart) {
            console.log(`No valid resume attachment found in email: ${subject}`);
            skippedCount++;
            continue;
          }
  
          try {
            const attachment = await gmail.users.messages.attachments.get({
              userId: "primusindus@gmail.com",
              messageId: message.id,
              id: attachmentPart.body.attachmentId,
            });

            // console.log("attachment :", attachment.data.data);
  
            if (!attachment.data.data) {
              console.log(`Failed to get attachment data for email: ${subject}`);
              skippedCount++;
              continue;
            }
  
            const resumeBuffer = Buffer.from(attachment.data.data, "base64url");
            // const resumeContent = resumeBuffer.toString("utf-8");

            // If the attachment is a PDF, extract text from it
            const resumeContent = await extractTextFromPdf(resumeBuffer);
            if (!resumeContent) {
              console.log(`Failed to extract text from PDF for email: ${subject}`);
              skippedCount++;
              continue;
            }
            
            console.log("resume content: ", resumeContent);
            // Validate if it's actually a resume
            const isValidResume = await analyzeResume(resumeContent);
            console.log("isValidResume: ", isValidResume);
  
            if (!isValidResume) {
              console.log(`Invalid resume attachment in email: ${subject}`);
              skippedCount++;
              continue;
            }
            // return ; 
  
            // Extract job position from email
            const jobPosition = await extractJobDetails(subject, emailContent);
            console.log("jobPosition: ", jobPosition);
            if (!jobPosition) {
              console.log(`Could not extract job position from email: ${subject}`);
              skippedCount++;
              continue;
            }
  
            // Find matching job posting
            const matchingJobs = await findMatchingJobs(jobPosition);
            
            console.log("matchingJobs: ", matchingJobs);
            if (!matchingJobs || matchingJobs.length === 0) {
              console.log(`No matching jobs found for position: ${jobPosition}`);
              skippedCount++;
              continue;
            }
  
            // Extract candidate information from resume
            const candidateInfo = await analyzeResume(resumeContent, true);
  
            console.log("candidateInfo: ", candidateInfo);
            if (!candidateInfo || !candidateInfo.email) {
              console.log(
                `Failed to extract candidate info from resume in email: ${subject}`
              );
              skippedCount++;
              continue;
            }
  
            const jobPositionArray = [];
            // Process each matching job
            for (const job of matchingJobs) {
              try {
                // Create mock request and response objects
                const mockReq = {
                  params: { jobId: job.jobPostingId },
                  body: {
                    firstName: candidateInfo.firstName || "Unknown",
                    lastName: candidateInfo.lastName || "Unknown",
                    email: candidateInfo.email.toLowerCase(),
                    phoneNumber: candidateInfo.phoneNumber || "",
                  },
                  file: {
                    buffer: resumeBuffer,
                    originalname: attachment.filename || "resume.pdf",
                    mimetype: attachment.mimeType,
                  },
                };
  
                const mockRes = {
                    status: function (code) {
                      this.statusCode = code; // Store status code if needed
                      return this; // Return mockRes to enable chaining
                    },
                    json: function (data) {
                      if (this.statusCode !== 201) {
                        throw new Error(data.message || "Failed to create application");
                      }
                      return data;
                    },
                  };
  
                // Create the application
                await createApplication(mockReq, mockRes);
  
                jobPositionArray.push({
                  jobId: job.jobPostingId,
                  jobTitle: job.jobTitle
                });

                // processedCount++;
  
              } catch (error) {
                console.error(
                  `Failed to create application for job ${job.jobPostingId}:`,
                  error
                );
                continue;
              }
            }
  
            // Mark email as read
            try {
              const res = await gmail.users.messages.modify({
                userId: "primusindus@gmail.com",
                id: message.id,
                requestBody: {
                  removeLabelIds: ["UNREAD"],
                },
              });
              console.log(`Email marked as read: ${res.data.id}`);
            } catch (error) {
              console.error(`Failed to mark email as read: ${error.message}`);
            }
  
            processedCount++;
            processingResults.push({
              email: candidateInfo.email,
              candidateName: candidateInfo.firstName + ' ' + candidateInfo.lastName,
              subject: subject,
              position: jobPositionArray,
              matchedJobs: matchingJobs.length,
              status: 'success'
            });
          } catch (error) {
            console.error(`Error processing attachment for email: ${subject}`, error);
            skippedCount++;
            continue;
          }
        } catch (error) {
          console.error(`Error processing message ${message.id}:`, error);
          skippedCount++;
        }
      }
  
      return {
        success: true,
        processed: processedCount,
        skipped: skippedCount,
        details: processingResults,
        message: `Processed ${processedCount} emails, skipped ${skippedCount}`,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error in email processing:", error);
      throw error;
    } finally {
      client.release();
    }
  }
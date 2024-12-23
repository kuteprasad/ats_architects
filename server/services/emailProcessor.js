// src/services/emailProcessor.js
import { getGoogleServices } from "./googleServices.js";
import { findMatchingJobs } from "../utils/dbHelper.js";
import {
  extractJobDetails,
  analyzeResume,
  isJobEmail,
} from "../utils/geminiHelper.js";
import { createApplication } from "../controllers/applicationController.js";
import pool from "../config/db.js";

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

// Utility helper to validate the file mime type
function isValidFileType(mimeType) {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return validTypes.includes(mimeType);
  }

  export async function processIncomingEmail(req, res) {
    const client = await pool.connect();
    
    try {
      const { gmail } = await getGoogleServices();
  
      // Fetch unread emails
      const response = await gmail.users.messages.list({
        userId: "me",
        q: "is:unread has:attachment",
        maxResults: 10,
      });
  
      if (!response.data.messages) {
        return res.json({ message: 'No unread emails found' });
      }
  
      let processedCount = 0;
      let skippedCount = 0;
      const processingResults = [];
  
      for (const message of response.data.messages) {
        try {
          // Fetch full message details
          const fullMessage = await gmail.users.messages.get({
            userId: "me",
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
              userId: "me",
              messageId: message.id,
              id: attachmentPart.body.attachmentId,
            });
  
            if (!attachment.data.data) {
              console.log(`Failed to get attachment data for email: ${subject}`);
              skippedCount++;
              continue;
            }
  
            const resumeBuffer = Buffer.from(attachment.data.data, "base64url");
            const resumeContent = resumeBuffer.toString("utf-8");
  
            // Validate if it's actually a resume
            const isValidResume = await analyzeResume(resumeContent);
  
            if (!isValidResume) {
              console.log(`Invalid resume attachment in email: ${subject}`);
              skippedCount++;
              continue;
            }
  
            // Extract job position from email
            const jobPosition = await extractJobDetails(subject, emailContent);
            if (!jobPosition) {
              console.log(`Could not extract job position from email: ${subject}`);
              skippedCount++;
              continue;
            }
  
            // Find matching job posting
            const matchingJobs = await findMatchingJobs(jobPosition);
  
            if (!matchingJobs || matchingJobs.length === 0) {
              console.log(`No matching jobs found for position: ${jobPosition}`);
              skippedCount++;
              continue;
            }
  
            // Extract candidate information from resume
            const candidateInfo = await analyzeResume(resumeContent, true);
  
            if (!candidateInfo || !candidateInfo.email) {
              console.log(
                `Failed to extract candidate info from resume in email: ${subject}`
              );
              skippedCount++;
              continue;
            }
  
            // Process each matching job
            for (const job of matchingJobs) {
              try {
                // Create mock request and response objects
                const mockReq = {
                  params: { jobId: job.jobPostingId },
                  body: {
                    firstName: candidateInfo.firstName || "Unknown",
                    lastName: candidateInfo.lastName || "Unknown",
                    email: candidateInfo.email,
                    phoneNumber: candidateInfo.phoneNumber || "",
                  },
                  file: {
                    buffer: resumeBuffer,
                    originalname: attachment.filename || "resume.pdf",
                    mimetype: attachment.mimeType,
                  },
                };
  
                // const mockRes = {
                //   status: function (code) {
                //     return {
                //       json: function (data) {
                //         if (code !== 201) {
                //           throw new Error(
                //             data.message || "Failed to create application"
                //           );
                //         }
                //         return data;
                //       },
                //     };
                //   },
                // };
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
                console.log(
                  `Successfully created application for job ${job.jobPostingId}`
                );
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
              await gmail.users.messages.modify({
                userId: "me",
                id: message.id,
                requestBody: {
                  removeLabelIds: ["UNREAD"],
                },
              });
            } catch (error) {
              console.error(`Failed to mark email as read: ${error.message}`);
            }
  
            processedCount++;
            processingResults.push({
              emailId: message.id,
              subject: subject,
              candidate: {
                email: candidateInfo.email,
                position: jobPosition,
              },
              matchedJobs: matchingJobs.length,
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
  
      return res.json({
        processed: processedCount,
        skipped: skippedCount,
        details: processingResults,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in email processing:", error);
      return res.status(500).json({ message: `Failed to process emails: ${error.message}` });
    } finally {
      client.release();
    }
  }
  
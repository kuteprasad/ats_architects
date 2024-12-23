// src/services/emailProcessor.js
import { getGoogleServices } from './googleServices.js';
import { findMatchingJobs } from '../utils/dbHelper.js';
import { extractJobDetails, analyzeResume,isJobEmail } from '../utils/geminiHelper.js';
import { createApplication } from '../controllers/applicationController.js';

export async function processIncomingEmail() {
  try {
    const { gmail } = await getGoogleServices();
    
    // Fetch unread emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 10
    });

    if (!response.data.messages) {
      return { processed: 0, skipped: 0, message: 'No unread messages found' };
    }

    let processedCount = 0;
    let skippedCount = 0;
    const processingResults = [];

    for (const message of response.data.messages) {
      try {
        // Fetch full message details
        const fullMessage = await gmail.users.messages.get({
          userId: 'me',
          id: message.id
        });

        // Extract email data
        const headers = fullMessage.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const from = headers.find(h => h.name === 'From')?.value || '';
        
        // Check if email is job-related using Gemini
        const emailContent = fullMessage.data.snippet || '';
        const isJobRelated = await isJobEmail(subject, emailContent);
        
        if (!isJobRelated) {
          console.log(`Skipping non-job email: ${subject}`);
          skippedCount++;
          continue;
        }





        // Find resume attachment
const parts = fullMessage.data.payload.parts || [];
let attachment = null;

// Recursive function to find attachments in nested parts
const findAttachment = (parts) => {
  for (const part of parts) {
    if (part.filename && isValidFileType(part.mimeType)) {
      return {
        filename: part.filename,
        mimeType: part.mimeType,
        attachmentId: part.body.attachmentId
      };
    }
    if (part.parts) {
      const found = findAttachment(part.parts);
      if (found) return found;
    }
  }
  return null;
};

// Look for attachment in all parts
const foundAttachment = findAttachment(parts);

if (!foundAttachment) {
  console.log(`Skipping email without resume: ${subject}`);
  skippedCount++;
  continue;
}

// Get attachment content
const attachmentData = await gmail.users.messages.attachments.get({
  userId: 'me',
  messageId: message.id,
  id: foundAttachment.attachmentId
});
        // Find resume attachment
        // const parts = fullMessage.data.payload.parts || [];
        // const attachment = parts.find(
        //   part => part.mimeType === 'application/pdf' || 
        //          part.mimeType === 'application/msword' ||
        //          part.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        // );

        // if (!attachment) {
        //   console.log(`Skipping email without resume: ${subject}`);
        //   skippedCount++;
        //   continue;
        // }

        // // Get attachment content
        // const attachmentData = await gmail.users.messages.attachments.get({
        //   userId: 'me',
        //   messageId: message.id,
        //   id: attachment.body.attachmentId
        // });

        if (!attachmentData.data.data) {
          console.log(`Failed to get attachment data for email: ${subject}`);
          skippedCount++;
          continue;
        }

        // Convert attachment to text for analysis
        const resumeBuffer = Buffer.from(attachmentData.data.data, 'base64');
        const resumeContent = resumeBuffer.toString('utf-8');

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
          console.log(`Failed to extract candidate info from resume in email: ${subject}`);
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
                firstName: candidateInfo.firstName || 'Unknown',
                lastName: candidateInfo.lastName || 'Unknown',
                email: candidateInfo.email,
                phoneNumber: candidateInfo.phoneNumber || ''
              },
              file: {
                buffer: resumeBuffer,
                originalname: attachment.filename || 'resume.pdf',
                mimetype: attachment.mimeType
              }
            };

            const mockRes = {
              status: function(code) {
                return {
                  json: function(data) {
                    if (code !== 201) {
                      throw new Error(data.message || 'Failed to create application');
                    }
                    return data;
                  }
                };
              }
            };

            // Create the application
            await createApplication(mockReq, mockRes);
            console.log(`Successfully created application for job ${job.jobPostingId}`);
          } catch (error) {
            console.error(`Failed to create application for job ${job.jobPostingId}:`, error);
            continue;
          }
        }

        // Mark email as read
        await gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: {
            removeLabelIds: ['UNREAD']
          }
        });

        processedCount++;
        processingResults.push({
          emailId: message.id,
          subject: subject,
          candidate: {
            email: candidateInfo.email,
            position: jobPosition
          },
          matchedJobs: matchingJobs.length
        });

      } catch (error) {
        console.error(`Error processing message ${message.id}:`, error);
        skippedCount++;
      }
    }

    return {
      processed: processedCount,
      skipped: skippedCount,
      details: processingResults,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error in email processing:', error);
    throw new Error(`Failed to process emails: ${error.message}`);
  }
}

// Utility helper to validate the file mime type
function isValidFileType(mimeType) {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return validTypes.includes(mimeType);
}
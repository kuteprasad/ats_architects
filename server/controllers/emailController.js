import { authorize } from '../services/gmailServices.js';
import { google } from 'googleapis';

const auth = authorize();

export async function processIncomingEmail(auth) {
  try {
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Get unread messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread'
    });


    const messages = response.data.messages || [];
    const emailDetails = [];

    for (const message of messages) {
      try {
        // Get message details
        const mail = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });
    
        // Extract headers
        const headers = mail.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const email = headers.find(h => h.name === 'From')?.value || '';
        
        if (!email) continue;
    
        // Extract body and subject to extract job position
        let jobPosition = null;
        if (subject) {
          jobPosition = await extractJobPosition(subject);
        }

        // If no job position in subject, check body
        if (!jobPosition || jobPosition === "No job position found.") {
          let body = '';
          if (mail.data.payload.parts) {
            const textPart = mail.data.payload.parts.find(part => part.mimeType === 'text/plain');
            if (textPart && textPart.body.data) {
              body = Buffer.from(textPart.body.data, 'base64').toString();
            }
          } else if (mail.data.payload.body.data) {
            body = Buffer.from(mail.data.payload.body.data, 'base64').toString();
          }
          
          jobPosition = await extractJobPosition(body);
        }

        console.log("Extracted Job Position:", jobPosition);

        // Perform actions if valid job position found
        if (jobPosition && jobPosition !== "No job position found.") {
          console.log(`Performing actions for job position: ${jobPosition}`);
        }

        // Query job posting details
          
        try{
            const jobPostingQuery = `
            SELECT 
              "jobPostingId",
              "jobTitle",
              "jobDescription",
              "location",
              "salaryRange",
              "jobPosition",
              "postingDate",
              "applicationEndDate",
              "jobRequirements"
            FROM "jobPostings" 
            WHERE LOWER("jobTitle") = LOWER($1)
          `;

          const jobPostingResult = await pool.query(jobPostingQuery, [jobPosition]);

          if (jobPostingResult.rows.length > 0) {
            const jobDetails = jobPostingResult.rows[0];

            // Check if application deadline has passed
            const currentDate = new Date();
            const deadlineDate = new Date(jobDetails.applicationEndDate);
            
            if (deadlineDate && deadlineDate < currentDate) {
              console.log('Application deadline has passed for job:', jobDetails.jobTitle);
              continue; // Skip to next email
            }

            console.log('Found matching job posting:', {
              id: jobDetails.jobPostingId,
              title: jobDetails.jobTitle,
              description: jobDetails.jobDescription,
              location: jobDetails.location,
              salary: jobDetails.salaryRange,
              position: jobDetails.jobPosition,
              posted: jobDetails.postingDate,
              deadline: jobDetails.applicationEndDate,
              requirements: jobDetails.jobRequirements
            });
            
            // Store job posting reference
            const jobPostingId = jobDetails.jobPostingId;
            
          } else {
            console.log('No matching job posting found for position:', jobPosition);
          }
          }
          catch(error){
            console.error("Error inserting job posting details:", error);
            throw error;
          }

        // Process attachments

        let firstName, lastName, phoneNumber;

        const attachments = [];
        if (mail.data.payload.parts) {
          const attachmentParts = mail.data.payload.parts.filter(part => part.filename && part.filename.length > 0);
          
          // Check if there's exactly one attachment
          if (attachmentParts.length === 1) {
            const part = attachmentParts[0];
            try {
              const attachment = {
                filename: part.filename,
                mimeType: part.mimeType,
                attachmentId: part.body.attachmentId
              };
          
              if (attachment.attachmentId && attachment.filename.toLowerCase().includes('resume')) {
                const attachmentData = await gmail.users.messages.attachments.get({
                  userId: 'me',
                  messageId: message.id,
                  id: attachment.attachmentId
                });
          
                const binaryData = Buffer.from(attachmentData.data.data, 'base64');
                
                // Extract first and last name from resume content
                try {
                  const resumeText = binaryData.toString('utf-8');
                  let name = await extractFirstLastName(resumeText);
                  phoneNumber = resumeText.match(/(\d{3})\D*(\d{3})\D*(\d{4})/)?.[0];
                  [firstName, lastName] = name.split(" ");

                } catch (extractError) {
                  console.error('Error extracting names from resume:', extractError);
                }
              }
              attachments.push(attachment);
            } catch (error) {
              console.error(`Error processing attachment: ${part.filename}`, error);
            }
          }
        }

        let candidateId;
        const candidateResult = await pool.query(
          'INSERT INTO candidates ("firstName", "lastName", "email", "phoneNumber") VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET firstName = $1, lastName = $2 RETURNING "candidateId"',
          [firstName || 'Unknown', lastName || 'Unknown', email, phoneNumber]
        );
        candidateId = candidateResult.rows[0].candidateId;

        if (jobDetails && jobDetails.jobPostingId && binaryData) {
          try {
            await pool.query(
              `INSERT INTO applications 
                ("candidateId", "jobPostingId", "resume", "applicationStatus")
               VALUES ($1, $2, $3, $4)`,
              [
                candidateId,
                jobDetails.jobPostingId,
                binaryData,
                'PENDING'
              ]
            );
            console.log('Application created successfully');
          } catch (error) {
            console.error('Error creating application:', error);
          }
        }
    
        // Mark message as read
        await gmail.users.messages.modify({
          userId: 'me',
          id: message.id,
          requestBody: {
            removeLabelIds: ['UNREAD']
          }
        });
    
        emailDetails.push({
          id: message.id,
          subject,
          from: email,
          body,
          attachments,
          candidateId
        });
    
      } catch (error) {
        console.error(`Error processing message ${message.id}:`, error);
        continue;
      }
    }

    return emailDetails;
  } catch (error) {
    console.error('Error processing emails:', error);
    throw error;
  }
}

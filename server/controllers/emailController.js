import pool from '../config/db';
import { authorize } from '../services/gmailServices';
import { google } from 'googleapis';
import pool from '../config/db.js';

async function listofLables(authorize){

  const gmail = google.gmail({ version: 'v1', authorize });
  const res = await gmail.users.labels.list({
    userId: 'me' 
  });
}

async function getEmails(authorize) {
  try {
    const gmail = google.gmail({ version: 'v1', authorize });
    
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
    
        // Check if candidate exists
        const checkCandidateQuery = `
          SELECT "candidateId" 
          FROM "candidates" 
          WHERE "email" = $1
        `;
        
        let candidateResult = await pool.query(checkCandidateQuery, [email]);
        let candidateId;
    
        if (candidateResult.rows.length > 0) {
          candidateId = candidateResult.rows[0].candidateId;
        } else {
          // Extract name from email
          const [firstName, lastName] = parseNameFromEmail(email);
          
          // Create new candidate
          const createCandidateQuery = `
            INSERT INTO "candidates" ("firstName", "lastName", "email")
            VALUES ($1, $2, $3)
            RETURNING "candidateId"
          `;
          candidateResult = await pool.query(createCandidateQuery, [firstName, lastName, email]);
          candidateId = candidateResult.rows[0].candidateId;
        }
    
        // Extract body
        let body = '';
        if (mail.data.payload.parts) {
          const textPart = mail.data.payload.parts.find(part => part.mimeType === 'text/plain');
          if (textPart && textPart.body.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        } else if (mail.data.payload.body.data) {
          body = Buffer.from(mail.data.payload.body.data, 'base64').toString();
        }
    
        // Process attachments
        const attachments = [];
        if (mail.data.payload.parts) {
          const attachmentParts = mail.data.payload.parts.filter(part => part.filename && part.filename.length > 0);
          
          for (const part of attachmentParts) {
            try {
              const attachment = {
                filename: part.filename,
                mimeType: part.mimeType,
                attachmentId: part.body.attachmentId
              };
    
              if (attachment.attachmentId) {
                const attachmentData = await gmail.users.messages.attachments.get({
                  userId: 'me',
                  messageId: message.id,
                  id: attachment.attachmentId
                });
    
                const binaryData = Buffer.from(attachmentData.data.data, 'base64');
    
                if (attachment.filename.toLowerCase().includes('resume')) {
                  await pool.query(
                    
                  );
                }
              }
              attachments.push(attachment);
            } catch (error) {
              console.error(`Error processing attachment: ${part.filename}`, error);
              continue;
            }
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

 
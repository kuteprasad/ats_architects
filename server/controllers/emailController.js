import pool from '../config/db.js';
import gmailService from '../services/gmailService.js';

export const processIncomingEmail = async (req, res) => {
  try {
    const { messageId } = req.body;
    const email = await gmailService.processEmail(messageId);
    
    // const query = `
    //   INSERT INTO "emails" ("senderEmail", "subject", "body", "attachmentPath")
    //   VALUES ($1, $2, $3, $4)
    //   RETURNING *
    // `;
    
    // const values = [
    //   email.sender,
    //   email.subject,
    //   email.body,
    //   email.attachments[0]?.filename
    // ];

    // await pool.query(query, values);
    console.log('Email body', email.body);
    res.status(200).json({ message: 'Email processed successfully' });
  } catch (error) {
    console.error('Error processing email:', error);
    res.status(500).json({ error: 'Failed to process email' });
  }
};
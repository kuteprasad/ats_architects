import pool from '../config/db.js';
import { calculateResumeScore } from '../utils/geminiScoring.js';
import { Buffer } from 'buffer';
import * as pdfjsLib from 'pdfjs-dist';

export const updateResumeScore = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const getApplicationsQuery = `
      SELECT 
        a."applicationId",
        a."resume",
        j."jobTitle",
        j."jobDescription",
        j."jobRequirements",
        j."jobPosition"
      FROM "applications" a
      JOIN "jobPostings" j ON a."jobPostingId" = j."jobPostingId"
      WHERE a."resumeScore" = 0 OR a."resumeScore" IS NULL
    `;
    
    const { rows: applications } = await client.query(getApplicationsQuery);
    
    if (applications.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No new applications found!'
      });
    }

    let processed = 0;
    let failed = 0;

    for (const app of applications) {
      try {
        // Convert BLOB to ArrayBuffer
        const buffer = Buffer.from(app.resume);
        const data = new Uint8Array(buffer);
        
        // Load PDF document
        const doc = await pdfjsLib.getDocument({ data }).promise;
        let resumeText = '';
        
        // Extract text from all pages
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map(item => item.str).join(' ');
          resumeText += text + ' ';
        }
        
        // Prepare job context with position
        const jobContext = `
          Job Title: ${app.jobTitle}
          Job Position: ${app.jobPosition}
          Job Description: ${app.jobDescription}
          Requirements: ${app.jobRequirements}
        `.trim();

        // Get score from Gemini
        const score = await calculateResumeScore(jobContext, resumeText);

        // Update score in database
        await client.query(`
          UPDATE "applications"
          SET "resumeScore" = $1
          WHERE "applicationId" = $2
        `, [score, app.applicationId]);

        processed++;
        
      } catch (error) {
        console.error(`Failed to process application ${app.applicationId}:`, error);
        failed++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed ${processed} applications, ${failed} failed`
    });

  } catch (error) {
    console.error('Error in updateResumeScore:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    client.release();
  }
};
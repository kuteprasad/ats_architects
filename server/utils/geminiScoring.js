import { GoogleGenerativeAI } from '@google/generative-ai';
import { RESUME_ANALYSIS_PROMPT } from './geminiPrompt.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const calculateResumeScore = async (jobContext, resumeContent) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    ${RESUME_ANALYSIS_PROMPT}

    JOB DETAILS:
    ${jobContext}

    RESUME:
    ${resumeContent}

    Return only a number between 0-100.
  `;

  console.log("prompt: ", prompt);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    const score = parseFloat(response);
    
    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error('Invalid score received from AI');
    }

    return score;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};
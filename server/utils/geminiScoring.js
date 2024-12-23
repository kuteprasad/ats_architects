import { RESUME_ANALYSIS_PROMPT } from './geminiPrompt.js';
import { getGeminiResponse } from './geminiApi.js';

export const calculateResumeScore = async (jobContext, resumeContent) => {
  const prompt = `
    ${RESUME_ANALYSIS_PROMPT}

    JOB DETAILS:
    ${jobContext}

    RESUME:
    ${resumeContent}

    Return only a number between 0-100.
  `;

  try {
    const response = await getGeminiResponse(prompt);
    const score = parseFloat(response);
    
    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error('Invalid score received from AI');
    }

    return score;
  } catch (error) {
    console.error('Resume scoring error:', error);
    throw error;
  }
};
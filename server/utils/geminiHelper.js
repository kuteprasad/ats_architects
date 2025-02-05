import { getGeminiResponse } from './geminiApi.js';

export async function isJobEmail(subject, body) {
  const prompt = `
    Analyze if this email is related to a job application.
    Subject: ${subject}
    Body: ${body}
    Return only true or false.
  `;

  try {
    const response = await getGeminiResponse(prompt);
    return response.toLowerCase().includes('true');
  } catch (error) {
    console.error('Error analyzing job email:', error);
    throw error;
  }
}

export async function analyzeResume(content, extractDetails = false) {
  try {
    if (extractDetails) {
      const prompt = `
        Extract the following information from this resume:
        ${content}
        
        Required fields:
        - firstName
        - lastName
        - email
        - phoneNumber
        
        Return as JSON.
      `;

      const response = await getGeminiResponse(prompt);
      
      // Clean the response to ensure it's a valid JSON format
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      
      // Parse the cleaned JSON response
      const result = JSON.parse(cleanedResponse);
      return result;

    } else {
      const prompt = `
        Analyze if this content is a valid resume:
        ${content}
        Return only true or false.
      `;
      
      const response = await getGeminiResponse(prompt);
      return response.toLowerCase().includes('true');
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

export async function extractJobDetails(content) {
  const prompt = `
    Extract the job position from this email content:
    ${content}
    Return only the position title without any additional text.
  `;

  try {
    const position = await getGeminiResponse(prompt);
    return position.trim();
  } catch (error) {
    console.error('Error extracting job details:', error);
    throw error;
  }
}


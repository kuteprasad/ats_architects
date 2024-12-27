import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);

    console.log('Gemini API response:', result.response.text());

    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};
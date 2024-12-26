
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';


dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function generateContent(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}

export async function extractJobPosition(body) {
  const prompt = `
    Analyze the following text and extract the job position mentioned:
    "${body}"
    If no job position is found, respond with "No job position found."
    Respond only with "Job Position Value" or "No job position found"  as I am going to use it as a variable to assign.
  `;
  try {
    const response = await generateContent(prompt);
    return response.trim();
  } catch (error) {
    console.error("Error extracting job position with Gemini AI:", error);
    return "No job position found.";
  }
}

export async function extractFirstLastName(resumeText) {
      const prompt = `
        Analyze the following text and extract the first and last name mentioned:
        "${resumeText}"
        If no name is found, respond with "No name found." Respond only with "firstName lastName" or "No name found"  as I am going to use it as a variable to assign.
      `;
      try {
        const response = await generateContent(prompt);
        return response.trim();
      } catch (error) {
        console.error("Error extracting name with Gemini AI:", error);
        return "No name found.";
      }
}


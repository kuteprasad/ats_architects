import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function isJobEmail(subject, body) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Analyze if this email is related to a job application.
    Subject: ${subject}
    Body: ${body}
    Return only true or false.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().toLowerCase();
  return text.includes('true');
}

export async function analyzeResume(content, extractDetails = false) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  if (extractDetails) {
    const prompt = `Extract the following information from this resume:
      - First Name
      - Last Name
      - Email
      - Phone Number
      Return as JSON.`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } else {
    const prompt = `Is this content a valid resume? Return only true or false.`;
    const result = await model.generateContent(prompt);
    return result.response.text().toLowerCase().includes('true');
  }
}

export async function extractJobDetails(subject, body) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `Extract the job position from this email:
    Subject: ${subject}
    Body: ${body}
    Return only the job title.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}


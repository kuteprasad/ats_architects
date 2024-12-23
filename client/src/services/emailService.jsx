import api from "./api";


export const sendEmail = async (emailData) => {
  try {
    const response = await api.post('/google/send-emails', emailData);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
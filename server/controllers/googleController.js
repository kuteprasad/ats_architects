import { processIncomingEmail } from '../services/emailProcessor.js';
import { getGoogleServices } from '../services/googleServices.js';

export const getEmails = async (req, res) => {
  try {
    const { gmail } = await getGoogleServices();

    // Fetch the list of messages
    const listResponse = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    const messages = listResponse.data.messages;

    // Fetch details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });
        return messageResponse.data;
      })
    );

    // Return the detailed messages
    res.status(200).json(detailedMessages);
  } catch (error) {
    console.error('Error getting email details:', error);
    res.status(500).json({ success: false, message: 'Failed to get emails', error: error.message });
  }
};




export const createMeeting = async (req, res) => {
  try {
    const { startDateTime, endDateTime, summary } = req.body;
    console.log("data received: ", req.body);
    
    const { meetClient } = await getGoogleServices();

    const request = {
      requestBody: {
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        },
        requestId: `interview-${Date.now()}`
      }
    };

    const response = await meetClient.createSpace(request);

    res.status(200).json({
      success: true,
      meetingId: response[0].name,
      joinUrl: response[0].meetingUri,
      startTime: startDateTime,
      endTime: endDateTime
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ success: false, message: 'Failed to create meeting', error: error.message });
  }
};


// src/controllers/emailController.js
export const processEmails = async (req, res) => {
  try {
    const result = await processIncomingEmail();
    console.log("res :", result);
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error processing emails:", error);
    res.status(500).json({ 
      success: false,
      message: `Failed to process emails: ${error.message}` 
    });
  }
};
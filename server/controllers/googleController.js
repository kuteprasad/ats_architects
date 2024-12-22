import { getGoogleServices } from '../services/googleServices.js';

export const listLabels = async (req, res) => {
  try {
    const { gmail } = await getGoogleServices();
    const response = await gmail.users.labels.list({
      userId: 'me'
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error listing labels:', error);
    res.status(500).json({ success: false, message: 'Failed to list labels', error: error.message });
  }
};

export const getEmails = async (req, res) => {
  try {
    const { gmail } = await getGoogleServices();
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting emails:', error);
    res.status(500).json({ success: false, message: 'Failed to get emails', error: error.message });
  }
};



export const createEvent = async (req, res) => {
  try {
    const { startDateTime, endDateTime, summary } = req.body;
    console.log("data received: ", req.body);
    
    const { calendar } = await getGoogleServices();

    const event = {
      summary,
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: `event-${Date.now()}`,
          conferenceSolutionKey: { 
            type: 'hangoutsMeet'
          }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      resource: event
    });

    res.status(200).json({
      success: true,
      eventId: response.data.id,
      joinUrl: response.data.hangoutLink,
      startTime: response.data.start.dateTime,
      endTime: response.data.end.dateTime
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ success: false, message: 'Failed to create event', error: error.message });
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

export const processIncomingEmail = async (req, res) => {
  try {
    const { gmail } = await getGoogleServices();
    const { emailId } = req.body;

    const response = await gmail.users.messages.get({
      userId: 'me',
      id: emailId
    });

    // Process the email content as needed
    const emailContent = response.data;

    res.status(200).json({ success: true, emailContent });
  } catch (error) {
    console.error('Error processing email:', error);
    res.status(500).json({ success: false, message: 'Failed to process email', error: error.message });
  }
};
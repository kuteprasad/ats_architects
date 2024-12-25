import { processIncomingEmail } from '../services/emailProcessor.js';
import { getGoogleServices } from '../services/googleServices.js';
import { EMAIL_TEMPLATES, formatTemplate } from '../utils/emailTemplates.js';

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

export const sendEmails = async (req, res) => {
  try {
    const emailData = req.body; // Array of dictionaries
    const { gmail } = await getGoogleServices();
    console.log("emailData: ", emailData);

    const results = await Promise.all(emailData.map(async data => {
      const { recipients, templateName, variables } = data;
      const template = EMAIL_TEMPLATES[templateName];

      if (!template) {
        throw new Error(`Invalid template name: ${templateName}`);
      }

      const emailResults = await Promise.all(recipients.map(async recipient => {
        try {
          const recipientVars = {
            ...variables,
            candidateName: recipient.name
          };

          const subject = formatTemplate(template.subject, recipientVars);
          const body = formatTemplate(template.body, recipientVars);

          const raw = Buffer.from(
            `From: me\r\n` +
            `To: ${recipient.email}\r\n` +
            `Subject: ${subject}\r\n\r\n` +
            `${body}`
          ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

          await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw }
          });

          return {
            email: recipient.email,
            status: 'sent',
            templateUsed: templateName
          };
        } catch (error) {

 // Catch and handle invalid email errors
 if (error?.response?.data?.error?.errors?.some(e => e.reason === 'invalidArgument')) {

  const errorMessage = error.response.data.error.message || "Unknown error occurred";
  console.error(`Error sending email to ${recipient.email}: ${errorMessage}`);
  // Specific handling for invalid email address
  if (errorMessage.includes("Invalid To header")) {
    console.error("The recipient email address is invalid.");
  }
  return {
    email: recipient.email,
    status: 'invalid email',
    templateUsed: templateName
  };
}
// Re-throw other errors to handle them globally
throw error;

        }
      }));

      return emailResults;
    }));

    res.status(200).json({
      success: true,
      message: 'Emails processed successfully',
      results: results.flat()
    });

  } catch (error) {
    console.error('Error processing emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process emails',
      error: error.message
    });
  }
};


// export const sendEmails = async (req, res) => {
//   try {
//     const emailData = req.body; // Array of dictionaries
//     const { gmail } = await getGoogleServices();
//     console.log("emailData: ", emailData);
    
//     const results = await Promise.all(emailData.map(async data => {
//       const { recipients, templateName, variables } = data;
//       const template = EMAIL_TEMPLATES[templateName];
      
//       if (!template) {
//         throw new Error(`Invalid template name: ${templateName}`);
//       }

//       const emailResults = await Promise.all(recipients.map(async recipient => {
//         const recipientVars = {
//           ...variables,
//           candidateName: recipient.name
//         };

//         const subject = formatTemplate(template.subject, recipientVars);
//         const body = formatTemplate(template.body, recipientVars);
        
//         const raw = Buffer.from(
//           `From: me\r\n` +
//           `To: ${recipient.email}\r\n` +
//           `Subject: ${subject}\r\n\r\n` +
//           `${body}`
//         ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

//         await gmail.users.messages.send({
//           userId: 'me',
//           requestBody: { raw }
//         });

//         return {
//           email: recipient.email,
//           status: 'sent',
//           templateUsed: templateName
//         };
//       }));

//       return emailResults;
//     }));

//     res.status(200).json({
//       success: true,
//       message: 'Emails sent successfully',
//       results: results.flat()
//     });
    
//   } catch (error) {
//     console.error('Error sending emails:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to send emails',
//       error: error.message
//     });
//   }
// };
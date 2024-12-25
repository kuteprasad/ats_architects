import api from "./api";

export const sendThankYouEmail = async (emailData) => {
  const formData =[{
    templateName: 'THANK_YOU',
    recipients: [{ name:emailData.candidateName, email: emailData.email}],
    variables: {
      position: emailData.jobTitle
    }
  }]

  // sample data to send 
  // {
  //   "templateName": "THANK_YOU",
  //   "recipients": [
  //     {
  //       "name": "Jane Smith",
  //       "email": "janesmith@example.com"
  //     }
  //   ],
  //   "variables": {
  //     "position": "Product Manager"
  //   }
  // }

  const res = await sendEmail(formData);
  return res; 
}

export const sendInterviewScheduledEmail = async (emailDataArray) => {
  console.log("emailDataArray : ", emailDataArray);
  const formattedData = emailDataArray.map(emailData => ({
    templateName: 'INTERVIEW_SCHEDULED',
    recipients: [{
      name: emailData.candidateName,
      email: emailData.email
    }],
    variables: {
      position: emailData.jobTitle,
      date: emailData.interviewDate,
      time: emailData.interviewTime,
      meetingLink: emailData.meetingLink,
      meetingId: emailData.meetingId
    }
  }));

  const res = await sendEmail(formattedData);
  return res;

  // sample data to send
  // {
  //   "templateName": "INTERVIEW_SCHEDULED",
  //   "recipients": [
  //     {
  //       "name": "John Doe",
  //       "email": "johndoe@example.com"
  //     }
  //   ],
  //   "variables": {
  //     "position": "Software Engineer",
  //     "date": "December 26, 2024",
  //     "time": "2:00 PM IST",
  //     "meetingLink": "https://meet.google.com/abc-defg-hij",
  //     "meetingId": "123 456 789"
  //   }
  // }
}

export const sendFinalStatusEmail = async (emailData) => {

  const formData = [{
    templateName: 'FINAL_STATUS',
    recipients: [{ name:emailData.candidateName, email: emailData.email}],
    variables: {
      position: emailData.jobTitle,
      status: emailData.status
    }
  }]
  const res = await sendEmail(formData);
  return res;

  // {
  //   "templateName": "FINAL_STATUS",
  //   "recipients": [
  //     {
  //       "name": "Mike Johnson",
  //       "email": "mikejohnson@example.com"
  //     }
  //   ],
  //   "variables": {
  //     "position": "Data Analyst",
  //     "status": "selected"  // can be "selected", "rejected", or "onhold"
  //   }
  // }
}


export const sendEmail = async (formData) => {
  try {
    const response = await api.post('/google/send-emails', formData);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
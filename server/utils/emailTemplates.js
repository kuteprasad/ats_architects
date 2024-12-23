export const EMAIL_TEMPLATES = {
  INTERVIEW_SCHEDULED: {
    subject: "Interview Scheduled: {{position}}",
    body: `
      Dear {{candidateName}},
      
      Your interview for {{position}} has been scheduled for {{date}} at {{time}}.
      
      Meeting Link: {{meetingLink}}
      Meeting ID: {{meetingId}}
      
      Best regards,
      HR Team
    `
  },
  THANK_YOU: {
    subject: "Thank You for Applying to {{position}}",
    body: `
      Dear {{candidateName}},
      
      Thank you for applying to the {{position}} position at our company. We have received your application and our team is currently reviewing it.
      
      We appreciate your interest in joining our team.
      
      Best regards,
      HR Team
    `
  },
  FINAL_STATUS: {
    subject: "Application Status for {{position}}",
    body: `
      Dear {{candidateName}},
      
      We have completed the review of your application for the {{position}} position.
      
      Status: {{status}}
      
      {{#if status === 'selected'}}
      Congratulations! You have been selected for the position. Our HR team will contact you with further details.
      {{/if}}
      
      {{#if status === 'rejected'}}
      We regret to inform you that you have not been selected for the position. We encourage you to apply for other opportunities in the future.
      {{/if}}
      
      {{#if status === 'onhold'}}
      Your application is currently on hold. We will update you on the next steps shortly.
      {{/if}}
      
      Best regards,
      HR Team
    `
  }
};

export const formatTemplate = (template, variables) => {
  let formatted = template;
  Object.keys(variables).forEach(key => {
    formatted = formatted.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
  });
  return formatted;
};
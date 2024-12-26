import React, { useState } from 'react';
import api from '../services/api';
import Button from '../components/common/Button';

const SendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const emailData = {
    recipients: [
      { name: 'John Doe', email: 'prasadkute0708@gmail.com' },
      { name: 'Jane Smith', email: 'shraddha.22210915@viit.ac.in' }
    ],
    templateName: 'INTERVIEW_SCHEDULED',
    variables: {
      position: 'Software Engineer',
      date: '2024-03-20',
      time: '10:00 AM',
      meetingLink: 'https://meet.google.com/xyz',
      meetingId: '123-456-789'
    }
  };

  const handleSendEmail = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await api.post('/google/send-emails', emailData);
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send emails' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Send Email</h1>
      <Button onClick={handleSendEmail} disabled={loading} variant="primary">
        {loading ? 'Sending...' : 'Send Emails'}
      </Button>
      {message && (
        <div className={`mt-4 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default SendEmail;
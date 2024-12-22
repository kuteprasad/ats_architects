import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import Button from '../components/common/Button';
import api from '../services/api';

const GetEmails = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/google/emails');
      console.log('Emails received:', response.data);
      setEmails(response.data || []);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err.response?.data?.message || 'Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Messages</h1>
        <Button 
          onClick={fetchEmails}
          disabled={loading}
          variant="secondary"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading emails...</div>
      ) : (
        <div className="space-y-4">
          {emails.length === 0 ? (
            <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow">
              No emails found
            </div>
          ) : (
            emails.map((email) => (
              <div 
                key={email.id} 
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">
                      ID: {email.id}
                    </span>
                    <div className="flex gap-1">
                      {email.labelIds.map((label) => (
                        <span 
                          key={label}
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-900">{email.snippet}</p>
                  {email.payload && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Thread ID: {email.threadId}</p>
                      <p>Subject: {email.payload.headers?.find(h => h.name === 'Subject')?.value}</p>
                      <p>From: {email.payload.headers?.find(h => h.name === 'From')?.value}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GetEmails;
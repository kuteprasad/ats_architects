import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/common/Button';

const CreateMeeting = () => {
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [summary, setSummary] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/create-meeting', { startDateTime, endDateTime, summary });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Google Meet</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Date/Time</label>
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date/Time</label>
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <Button type="submit" disabled={loading} variant="primary" className="w-full">
          {loading ? 'Creating...' : 'Create Meeting'}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-medium mb-2">Meeting Created:</h3>
          <p>Meeting ID: {response.meetingId}</p>
          <p>Join URL: <a href={response.joinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{response.joinUrl}</a></p>
          <p>Start Time: {response.startTime}</p>
          <p>End Time: {response.endTime}</p>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;
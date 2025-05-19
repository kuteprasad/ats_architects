import React from 'react';
import api from '../../../../services/api';

export const GeneratedSchedule = ({ schedule }) => {
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCandidateById = async (candidateId) => {
  try {
    const response = await api.get(`/candidates/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate:', error);
    throw error;
  }
};

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Generated Schedule</h3>
      {schedule.map((day, index) => (
        <div key={index} className="mb-6">
          {/* <h4 className="font-medium mb-2">
            {new Date(day.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h4> */}
          <div className="space-y-2">
            {day.interviews.map((interview, idx) => (
              <div key={idx} className="border p-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      Time: {formatDateTime(interview.startTime)} - {new Date(interview.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                    <p>Interviewer ID: {interview.interviewer}</p>
                    <p>Application ID: {interview.candidate}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  {interview.meetingId ? (
                    <>
                      <p className="text-gray-600">Meeting ID: {interview.meetingId}</p>
                      <p className="text-gray-600">
                        Join URL: 
                        <a 
                          href={interview.joinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-600 hover:underline"
                        >
                          {interview.joinUrl}
                        </a>
                      </p>
                    </>
                  ) : (
                    <p className="text-red-500">{interview.meetingError || 'Meeting details not available'}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
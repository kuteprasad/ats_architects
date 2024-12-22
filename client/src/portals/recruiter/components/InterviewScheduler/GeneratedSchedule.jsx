import React from 'react';

export const GeneratedSchedule = ({ schedule }) => {
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Generated Schedule</h3>
        {schedule.map((day, index) => (
          <div key={index} className="mb-6">
            <h4 className="font-medium mb-2">
              {day.date.toLocaleDateString()}
            </h4>
            <div className="space-y-2">
              {day.interviews.map((interview, idx) => (
                <div key={idx} className="border p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Time: {interview.startTime.toLocaleTimeString()} - {interview.endTime.toLocaleTimeString()}</p>
                      <p>Interviewer ID: {interview.interviewer}</p>
                      <p>Candidate ID: {interview.candidate}</p>
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
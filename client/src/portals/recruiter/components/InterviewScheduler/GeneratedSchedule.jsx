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
              <div key={idx} className="flex items-center justify-between border p-3 rounded">
                <div>
                  <p>Time: {interview.startTime.toLocaleTimeString()} - {interview.endTime.toLocaleTimeString()}</p>
                  <p>Interviewer ID: {interview.interviewer}</p>
                  <p>Candidate ID: {interview.candidate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
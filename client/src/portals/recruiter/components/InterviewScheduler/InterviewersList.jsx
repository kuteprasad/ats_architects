import React from 'react';
import Button from '../../../../components/common/Button';

export const InterviewersList = ({ interviewers, selectedInterviewers, toggleInterviewer }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Available Interviewers</h2>
      <div className="space-y-2">
        {interviewers.map(interviewer => (
          <div 
            key={interviewer.id}
            className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{interviewer.name}</p>
              <p className="text-sm text-gray-600">{interviewer.email}</p>
            </div>
            <Button
              onClick={() => toggleInterviewer(interviewer.id)}
              variant={selectedInterviewers[interviewer.id] ? "primary" : "secondary"}
              size="sm"
            >
              {selectedInterviewers[interviewer.id] ? 'Selected' : 'Select'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

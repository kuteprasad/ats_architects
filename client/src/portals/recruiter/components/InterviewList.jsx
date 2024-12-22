import React from 'react';
import Button from '../../../components/common/Button';

const InterviewList = ({ interviews, onSelect, getStatusColor }) => {
  return (
    <div className="space-y-4">
      {interviews.map(interview => (
        <div key={interview.interviewId} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium">{interview.candidateName}</h3>
              <a 
                href={`mailto:${interview.candidateEmail}`}
                className="text-sm text-blue-600 hover:underline block"
              >
                {interview.candidateEmail}
              </a>
              <p className="text-sm text-gray-600">{interview.jobTitle}</p>
              <p className="text-sm text-gray-600">
                {new Date(`${interview.interviewDate} ${interview.interviewStartTime}`).toLocaleString()}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
              {interview.status}
            </span>
          </div>
          <Button onClick={() => onSelect(interview)} variant="secondary" className="mt-2">
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
};

export default InterviewList;
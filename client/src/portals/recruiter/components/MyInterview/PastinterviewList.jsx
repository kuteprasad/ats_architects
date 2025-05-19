import React from 'react';
import Button from '../../../../components/common/Button';

const formatDateTime = (date, time) => {
  try {
    // Extract date part from ISO string
    const datePart = date.split('T')[0];
    // Combine date and time
    const dateTimeString = `${datePart}T${time}`;
    // Create date object
    const dateObj = new Date(dateTimeString);
    
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (err) {
    console.error('Date formatting error:', err);
    return 'Invalid date';
  }
};

const PastinterviewList = ({ interviews, onSelect, getStatusColor }) => {
  const handleViewDetails = (interview) => {
    const initialFeedback = {
      communicationScore: interview.communicationScore || 0,
      technicalScore: interview.technicalScore || 0,
      experienceScore: interview.experienceScore || 0,
      problemSolvingScore: interview.problemSolvingScore || 0,
      culturalFitScore: interview.culturalFitScore || 0,
      timeManagementScore: interview.timeManagementScore || 0,
      overallScore: interview.overallScore || 0,
      cumulativeScore: interview.cumulativeScore || 0,
      comments: interview.comments || ''
    };

    onSelect(interview, initialFeedback);
  };

  return (
    <div className="space-y-4">
      {interviews.map(interview => (
        <div key={interview.interviewId} className="bg-white rounded-lg shadow p-4">
          {console.log("interview : ", interview)}
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
                {formatDateTime(interview.interviewDate, interview.interviewStartTime)}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
              {interview.status}
            </span>
          </div>
          {/* <Button 
            onClick={() => handleViewDetails(interview)} 
            variant="secondary" 
            className="mt-2"
          >
            View Details
          </Button> */}
        </div>
      ))}
    </div>
  );
};

export default PastinterviewList;
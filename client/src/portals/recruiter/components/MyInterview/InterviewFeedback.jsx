import React from 'react';
import StarRating from './StarRating';
import Button from '../../../../components/common/Button';
import ResumeViewer from '../../../../components/common/ResumeViewer';

const formatDateTime = (date, time) => {
  try {
    const datePart = date.split('T')[0];
    const dateTimeString = `${datePart}T${time}`;
    return new Date(dateTimeString).toLocaleString('en-US', {
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

const InterviewFeedback = ({ 
  interview, 
  ratings = {
    communicationScore: 0,
    technicalScore: 0,
    experienceScore: 0,
    problemSolvingScore: 0,
    culturalFitScore: 0,
    timeManagementScore: 0,
    overallScore: 0,
    cumulativeScore: 0
  },
  comments = '',
  onRatingChange,
  onCommentChange,
  onSubmit,
  onClose 
}) => {
  console.log('Current ratings:', ratings); // Debug log

  const validateFields = () => {
    if (!comments.trim()) {
      alert('Please provide comments');
      return false;
    }

    const requiredRatings = [
      'communicationScore',
      'technicalScore',
      'experienceScore',
      'problemSolvingScore',
      'culturalFitScore',
      'timeManagementScore',
      'overallScore'
    ];

    const missingRatings = requiredRatings.filter(rating => !ratings[rating]);
    
    if (missingRatings.length > 0) {
      alert(`Please provide ratings for: ${missingRatings.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleRatingChange = (key, value) => {
    console.log('Rating change:', key, value); // Debug log
    const updatedRatings = { ...ratings, [key]: value };
    
    const scores = Object.entries(updatedRatings)
      .filter(([k, v]) => 
        k !== 'cumulativeScore' && 
        typeof v === 'number' && 
        v > 0
      )
      .map(([_, v]) => v);
    
    const cumulativeScore = scores.length > 0 
      ? Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2))
      : 0;
    
    console.log('Updated ratings:', updatedRatings); // Debug log
    onRatingChange(key, value);
    onRatingChange('cumulativeScore', cumulativeScore);
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 relative">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
      </button>

      <div className="flex justify-between items-start mb-6 mr-16">
        <div className="space-y-1">
          <h3 className="font-medium">{interview.candidateName}</h3>
          <a href={`mailto:${interview.candidateEmail}`} className="text-sm text-blue-600 hover:underline">
            {interview.candidateEmail}
          </a>
          <p className="text-sm text-gray-600">
            {formatDateTime(interview.interviewDate, interview.interviewStartTime)}
          </p>
          <p className="text-sm text-gray-500">
            Duration: {interview.interviewStartTime} - {interview.interviewEndTime}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ResumeViewer resume={interview.resume} />
          <Button onClick={() => window.open(interview.joinUrl, '_blank')} variant="primary" className="bg-[#464EB8]">
            Join Meeting
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(ratings).map(([key, value]) => (
          key !== 'cumulativeScore' && (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim()} *
              </label>
              <StarRating
                key={`${key}-${value}`} // Force re-render on value change
                value={value}
                onChange={(newValue) => handleRatingChange(key, newValue)}
              />
            </div>
          )
        ))}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comments *
          </label>
          <textarea
            value={comments}
            onChange={onCommentChange}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

InterviewFeedback.defaultProps = {
  ratings: {
    communicationScore: 0,
    technicalScore: 0,
    experienceScore: 0,
    problemSolvingScore: 0,
    culturalFitScore: 0,
    timeManagementScore: 0,
    overallScore: 0,
    cumulativeScore: 0
  },
  comments: ''
};

export default InterviewFeedback;
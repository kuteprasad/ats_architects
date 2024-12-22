import React from 'react';
import StarRating from './StarRating';
import Button from '../../../components/common/Button';

const InterviewFeedback = ({ 
  interview, 
  ratings, 
  comments, 
  onRatingChange, 
  onCommentChange, 
  onSubmit 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="font-medium">{interview.candidateName}</h3>
          <a href={`mailto:${interview.candidateEmail}`} className="text-sm text-blue-600 hover:underline">
            {interview.candidateEmail}
          </a>
        </div>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => window.open(interview.resume, '_blank')} variant="secondary">
            View Resume
          </Button>
          <Button onClick={() => window.open(interview.joinUrl, '_blank')} variant="primary" className="bg-[#464EB8]">
            Join Teams Meeting
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(ratings).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <StarRating
              value={value}
              onChange={(newValue) => onRatingChange(key, newValue)}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-2">Comments</label>
          <textarea
            value={comments}
            onChange={onCommentChange}
            className="w-full border rounded-md p-2 min-h-[100px]"
          />
        </div>

        <Button onClick={onSubmit} variant="primary" className="w-full">
          Submit Feedback
        </Button>
      </div>
    </div>
  );
};

export default InterviewFeedback;
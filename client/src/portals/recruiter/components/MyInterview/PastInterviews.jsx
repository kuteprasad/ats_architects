import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import InterviewList from './InterviewList';
import PastinterviewList from './PastinterviewList';

const PastInterviews = ({ interviews, showPast, onToggle, onSelect, getStatusColor }) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <span className="text-lg font-semibold">Past Interviews</span>
        {showPast ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
      </button>

      {showPast && (
        <div className="mt-4">
          <PastinterviewList 
            interviews={interviews}
            onSelect={onSelect}
            getStatusColor={getStatusColor}
          />
        </div>
      )}
    </div>
  );
};

export default PastInterviews;
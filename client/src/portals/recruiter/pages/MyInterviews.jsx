import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import Loading from '../../../components/common/Loading';
import ErrorMessage from '../../../components/common/ErrorMessage';
import InterviewList from '../components/MyInterview/InterviewList';
import PastInterviews from '../components/MyInterview/PastInterviews';
import InterviewFeedback from '../components/MyInterview/InterviewFeedback';
import {
  DEFAULT_RATINGS,
  sortInterviews,
  getStatusColor,
  filterInterviews,
  prepareInterviewFeedback,
  parseInterviewScores
} from '../../../utils/myInterviewUtils';

const MyInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [showPastInterviews, setShowPastInterviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [ratings, setRatings] = useState(DEFAULT_RATINGS);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get(`/interviews/interviewer/${user.userId}`);
      const sortedInterviews = sortInterviews(response.data.interviews);
      setInterviews(sortedInterviews);
    } catch (err) {
      setError('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (interviewId) => {
    try {
      const feedbackData = prepareInterviewFeedback(interviewId, ratings, comments, user.id);
      const response = await api.post('/interviews/feedback', feedbackData);
      console.log('Feedback submitted:', response.data);
      setRatings(DEFAULT_RATINGS);
      setComments('');
      setSelectedInterview(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    const newRatings = parseInterviewScores(interview);
    setRatings(newRatings);
    setComments(interview.comments || '');
  };

  if (loading) return <Loading size="lg" text="Loading Interviews ..." />;
  if (error) return <ErrorMessage message={error} />;

  const { current: currentInterviews, past: pastInterviews } = filterInterviews(interviews);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Scheduled Interviews</h2>
            <InterviewList
              interviews={currentInterviews}
              onSelect={handleInterviewSelect}
              getStatusColor={getStatusColor}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <PastInterviews
              interviews={pastInterviews}
              showPast={showPastInterviews}
              onToggle={() => setShowPastInterviews(!showPastInterviews)}
              onSelect={setSelectedInterview}
              getStatusColor={getStatusColor}
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-6">
          {selectedInterview && (
            <InterviewFeedback 
              key={`feedback-${selectedInterview.interviewId}`}
              interview={selectedInterview}
              ratings={ratings}
              comments={comments}
              onRatingChange={(key, value) => setRatings(prev => ({ ...prev, [key]: value }))}
              onCommentChange={(e) => setComments(e.target.value)}
              onSubmit={() => handleRatingSubmit(selectedInterview.interviewId)}
              onClose={() => setSelectedInterview(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInterviews;
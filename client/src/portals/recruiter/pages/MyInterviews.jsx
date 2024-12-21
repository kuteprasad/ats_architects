import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import InterviewList from '../components/InterviewList';
import InterviewFeedback from '../components/InterviewFeedback';
import PastInterviews from '../components/PastInterviews';

const MyInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [showPastInterviews, setShowPastInterviews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [ratings, setRatings] = useState({
    communicationScore: 0,
    technicalScore: 0,
    experienceScore: 0,
    problemSolvingScore: 0,
    culturalFitScore: 0,
    timeManagementScore: 0,
    overallScore: 0,
    cumulativeScore: 0
  });
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get(`/interviews/interviewer/${user.id}`);
      const sortedInterviews = response.data.interviews.sort((a, b) => {
        const dateA = new Date(`${a.interviewDate} ${a.interviewStartTime}`);
        const dateB = new Date(`${b.interviewDate} ${b.interviewStartTime}`);
        return dateA - dateB;
      });
      setInterviews(sortedInterviews);
    } catch (err) {
      setError('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async () => {
    try {
      const blob = new Blob([selectedInterview.resume.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error('Error viewing resume:', err);
      alert('Failed to load resume');
    }
  };

  const handleRatingSubmit = async (interviewId) => {
    try {
      const cumulativeScore = Object.values(ratings)
        .filter(score => typeof score === 'number')
        .reduce((sum, score) => sum + score, 0);

      setRatings();
      const feedbackData = {
        interviewId,
        ...ratings,
        cumulativeScore,
        comments,
        interviewerId: user.id
      };

      console.log('Interview Feedback:', feedbackData);

      const response = await api.post('/interviews/feedback', feedbackData);
      console.log('Feedback submitted:', response.data);

      setRatings({
        communicationScore: 0,
        technicalScore: 0,
        experienceScore: 0,
        problemSolvingScore: 0,
        culturalFitScore: 0,
        timeManagementScore: 0,
        overallScore: 0,
        cumulativeScore: 0
      });

      setComments('');
      setSelectedInterview(null);

    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACCEPTED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

 
  const isInterviewPast = (date, endTime) => {
    const interviewEnd = new Date(`${date} ${endTime}`);
    return interviewEnd < new Date();
  };

  const currentInterviews = interviews.filter(
    interview => !isInterviewPast(interview.interviewDate, interview.interviewEndTime)
  );

  const pastInterviews = interviews.filter(
    interview => isInterviewPast(interview.interviewDate, interview.interviewEndTime)
  );

  if (loading) return <div className="p-6">Loading interviews...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Interviews</h1>

      {/* Scheduled Interviews */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Scheduled Interviews</h2>
        <InterviewList 
          interviews={currentInterviews}
          onSelect={setSelectedInterview}
          getStatusColor={getStatusColor}
        />
      </div>

      {/* Interview Feedback */}
      {selectedInterview && (
        <InterviewFeedback 
          interview={selectedInterview}
          ratings={ratings}
          comments={comments}
          onRatingChange={(key, value) => setRatings(prev => ({ ...prev, [key]: value }))}
          onCommentChange={(e) => setComments(e.target.value)}
          onSubmit={() => handleRatingSubmit(selectedInterview.interviewId)}
        />
      )}

      {/* Past Interviews */}
      <PastInterviews 
        interviews={pastInterviews}
        showPast={showPastInterviews}
        onToggle={() => setShowPastInterviews(!showPastInterviews)}
        onSelect={setSelectedInterview}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default MyInterviews;
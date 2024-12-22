import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import api from '../../../services/api';
import Button from '../../../components/common/Button';

// const SAMPLE_INTERVIEWS = [
//   {
//     interviewId: 1,
//     applicationId: 1,
//     jobPostingId: 1,
//     interviewerId: 101,
//     candidateName: "John Smith",
//     candidateEmail: "abc@g.c",
//     jobTitle: "Senior Frontend Developer",
//     interviewDate: "2024-03-25",
//     interviewStartTime: "10:00:00",
//     interviewEndTime: "11:00:00",
//     status: "ACCEPTED",
//     comments: null,
//     joinUrl: "https://meet.google.com/abc-defg-hij",
//     meetingId: "meet_123",
//     resume: null,
//     scores: {
//       communicationScore: 0,
//       technicalScore: 0,
//       experienceScore: 0,
//       problemSolvingScore: 0,
//       culturalFitScore: 0,
//       timeManagementScore: 0,
//       overallScore: 0,
//       cumulativeScore: 0

//     }
//   },
//   {
//     interviewId: 2,
//     applicationId: 2,
//     jobPostingId: 2,
//     interviewerId: 101,
//     candidateName: "Sarah Johnson",
//     candidateEmail: "abc@g.c",
//     jobTitle: "Backend Engineer",
//     interviewDate: "2024-03-25",
//     interviewStartTime: "14:00:00",
//     interviewEndTime: "15:00:00",
//     status: "REJECTED",
//     comments: null,
//     joinUrl: "https://meet.google.com/xyz-uvwx-yz",
//     meetingId: "meet_456",
//     resume: null,
//     scores: {
//       communicationScore: 0,
//       technicalScore: 0,
//       experienceScore: 0,
//       problemSolvingScore: 0,
//       culturalFitScore: 0,
//       timeManagementScore: 0,
//       overallScore: 0,
//       cumulativeScore: 0
//     }
//   },
//   {
//     interviewId: 3,
//     applicationId: 3,
//     jobPostingId: 2,
//     interviewerId: 101,
//     candidateName: "anuj sharma",
//     candidateEmail: "absdfdsfc@g.c",
//     jobTitle: "Backesdf sdf nd Engineer",
//     interviewDate: "2025-12-25",
//     interviewStartTime: "14:00:00",
//     interviewEndTime: "15:00:00",
//     status: "PENDING",
//     comments: null,
//     joinUrl: "https://meet.google.com/xyz-uvwx-yz",
//     meetingId: "meet_456",
//     resume: null,
//     scores: {
//       communicationScore: 0,
//       technicalScore: 0,
//       experienceScore: 0,
//       problemSolvingScore: 0,
//       culturalFitScore: 0,
//       timeManagementScore: 0,
//       overallScore: 0,
//       cumulativeScore: 0
//     }
//   },
//   {
//     interviewId: 4,
//     applicationId: 4,
//     jobPostingId: 2,
//     interviewerId: 101,
//     candidateName: "Shraddha Rao",
//     candidateEmail: "shradha@g.c",
//     jobTitle: "ML Engineer",
//     interviewDate: "2024-12-25",
//     interviewStartTime: "14:00:00",
//     interviewEndTime: "15:00:00",
//     status: "PENDING",
//     comments: null,
//     joinUrl: "https://meet.google.com/xyz-uvwx-yz",
//     meetingId: "meet_456",
//     resume: null,
//     scores: {
//       communicationScore: 0,
//       technicalScore: 0,
//       experienceScore: 0,
//       problemSolvingScore: 0,
//       culturalFitScore: 0,
//       timeManagementScore: 0,
//       overallScore: 0,
//       cumulativeScore: 0
//     }
//   }
// ];

const StarRating = ({ value, onChange, disabled }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          disabled={disabled}
          className={`text-2xl focus:outline-none ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

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

  // const fetchInterviewsTemp = async () => {
  //   try {
  //     // For development, use sample data
  //     const sortedInterviews = SAMPLE_INTERVIEWS.sort((a, b) => {
  //       const dateA = new Date(`${a.interviewDate} ${a.interviewStartTime}`);
  //       const dateB = new Date(`${b.interviewDate} ${b.interviewStartTime}`);
  //       return dateA - dateB;
  //     });
  //     setInterviews(sortedInterviews);
  //     setError(null);
      
  //   } catch (err) {
  //     setError('Failed to fetch interviews');
  //     console.error('Error fetching interviews:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

    // Add score calculation function
    // const calculateCumulativeScore = (scores) => {
    //   return Object.values(scores).reduce((sum, score) => sum + score, 0);
    // };

    const handleRatingSubmit = async (interviewId) => {
      try {
        // Calculate cumulative score
        const cumulativeScore = Object.values(ratings)
          .filter(score => typeof score === 'number')
          .reduce((sum, score) => sum + score, 0);
    
        setRatings()
        // const cumulativeScore = calculateCumulativeScore(ratings);
        // Prepare feedback data
        const feedbackData = {
          interviewId,
          ...ratings,
          cumulativeScore,
          comments,
          interviewerId: user.id
        };
    
        console.log('Interview Feedback:', feedbackData);

        // Call API to submit feedback
        const response = await api.post('/interviews/feedback', feedbackData);
        console.log('Feedback submitted:', response.data);
        
    
        // Reset form
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
        // Handle error - show toast/alert
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

  const formatDateTime = (date, time) => {
    return new Date(`${date} ${time}`).toLocaleString();
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

      {/* Upcoming Interviews */}
      {/* <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upcoming Interviews</h2>
        <div className="space-y-4">
          {currentInterviews.map(interview => (
            <div key={interview.interviewId} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{interview.candidateName}</h3>
                  <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                  <a 
                    href={`mailto:${interview.candidateEmail}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {interview.candidateEmail}
                  </a>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(interview.interviewDate, interview.interviewStartTime)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                  {interview.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Past Interviews Accordion */}
      <div className="mb-4">
        <button
          onClick={() => setShowPastInterviews(!showPastInterviews)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <span className="text-lg font-semibold">Past Interviews</span>
          {showPastInterviews ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>

        {showPastInterviews && (
          <div className="mt-4 space-y-4">
            {pastInterviews.map(interview => (
              <div key={interview.interviewId} className="bg-gray-50 rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{interview.candidateName}</h3>
                    <p className="text-sm text-gray-600">{interview.jobTitle}</p>
                    <a 
                      href={`mailto:${interview.candidateEmail}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {interview.candidateEmail}
                    </a>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(interview.interviewDate, interview.interviewStartTime)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                    {interview.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel - Interview List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Scheduled Interviews</h2>
          {currentInterviews.length === 0 ? (
            <p className="text-gray-500">No interviews scheduled</p>
          ) : (
            <div className="space-y-4">
              {currentInterviews.map(interview => (
                <div 
                  key={interview.interviewId}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors
                    ${selectedInterview?.interviewId === interview.interviewId ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedInterview(interview)}
                >
                  <p className="font-medium">{interview.candidateName}</p>
                  
                  <p className="text-sm text-gray-600">
                    {new Date(`${interview.interviewDate}T${interview.interviewStartTime}`).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Position: {interview.jobTitle}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Interview Details & Rating */}
        {selectedInterview && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h3 className="font-medium">{selectedInterview.candidateName}</h3>
            <a 
              href={`mailto:${selectedInterview.candidateEmail}`}
              className="text-sm text-blue-600 hover:underline block"
            >
              {selectedInterview.candidateEmail}
            </a>
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => handleViewResume()}
              variant="secondary"
              className="w-full"
            >
              View Resume
            </Button>
            <Button
              onClick={() => window.open(selectedInterview.joinUrl, '_blank')}
              variant="primary"
              className="w-full bg-[#464EB8] hover:bg-[#363AAD]"
            >
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
                    onChange={(newValue) => setRatings(prev => ({
                      ...prev,
                      [key]: newValue
                    }))}
                  />
                </div>
              ))}
              
              <div>
                <label className="block text-sm font-medium mb-2">Comments</label>
                <textarea
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  placeholder="Add your feedback..."
                />
              </div>

              <Button
                onClick={() => handleRatingSubmit(selectedInterview.interviewId)}
                variant="primary"
                className="w-full"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterviews;
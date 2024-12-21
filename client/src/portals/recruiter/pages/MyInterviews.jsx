import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import Button from '../../../components/common/Button';

const SAMPLE_INTERVIEWS = [
  {
    id: 1,
    candidateName: "John Smith",
    jobTitle: "Senior Frontend Developer",
    startTime: "2024-03-25T10:00:00",
    endTime: "2024-03-25T11:00:00",
    applicationId: "APP001",
    status: "SCHEDULED",
    candidateEmail: "john.smith@email.com"
  },
  {
    id: 2,
    candidateName: "Sarah Johnson",
    jobTitle: "Backend Engineer",
    startTime: "2024-03-25T14:00:00",
    endTime: "2024-03-25T15:00:00",
    applicationId: "APP002",
    status: "SCHEDULED",
    candidateEmail: "sarah.j@email.com"
  },
  {
    id: 3,
    candidateName: "Mike Wilson",
    jobTitle: "Full Stack Developer",
    startTime: "2024-03-26T11:00:00",
    endTime: "2024-03-26T12:00:00",
    applicationId: "APP003",
    status: "SCHEDULED",
    candidateEmail: "mike.w@email.com"
  }
];

const MyInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [ratings, setRatings] = useState({
    technicalSkills: 0,
    communication: 0,
    problemSolving: 0,
    cultureFit: 0,
    overallRating: 0
  });
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      // For development, use sample data
      setInterviews(SAMPLE_INTERVIEWS);
      setError(null);
      
      // Uncomment when API is ready
      // const response = await api.get(`/interviews/interviewer/${user.id}`);
      // setInterviews(response.data.interviews);
      
    } catch (err) {
      setError('Failed to fetch interviews');
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}/resume`);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error('Error viewing resume:', err);
      alert('Failed to load resume');
    }
  };

  const handleRatingSubmit = (interviewId) => {
    console.log('Interview Feedback:', {
      interviewId,
      ratings,
      comments,
      interviewerId: user.id,
      submittedAt: new Date().toISOString()
    });
    // Reset form
    setRatings({
      technicalSkills: 0,
      communication: 0,
      problemSolving: 0,
      cultureFit: 0,
      overallRating: 0
    });
    setComments('');
    setSelectedInterview(null);
  };

  if (loading) return <div className="p-6">Loading interviews...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Interviews</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel - Interview List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Scheduled Interviews</h2>
          {interviews.length === 0 ? (
            <p className="text-gray-500">No interviews scheduled</p>
          ) : (
            <div className="space-y-4">
              {interviews.map(interview => (
                <div 
                  key={interview.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors
                    ${selectedInterview?.id === interview.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedInterview(interview)}
                >
                  <p className="font-medium">{interview.candidateName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(interview.startTime).toLocaleString()}
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
            <h2 className="text-lg font-semibold mb-4">Interview Feedback</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{selectedInterview.candidateName}</h3>
                <Button 
                  onClick={() => handleViewResume(selectedInterview.applicationId)}
                  variant="secondary"
                  size="sm"
                >
                  View Resume
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Interview Time: {new Date(selectedInterview.startTime).toLocaleString()}
              </p>
            </div>

            <div className="space-y-6">
              {Object.entries(ratings).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={value}
                      onChange={e => setRatings(prev => ({
                        ...prev,
                        [key]: parseInt(e.target.value)
                      }))}
                      className="flex-grow"
                    />
                    <span className="text-sm font-medium w-8 text-center">
                      {value}/5
                    </span>
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Comments
                </label>
                <textarea
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Add your feedback about the candidate..."
                  className="w-full border rounded-md p-2 min-h-[100px]"
                />
              </div>

              <Button
                onClick={() => handleRatingSubmit(selectedInterview.id)}
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
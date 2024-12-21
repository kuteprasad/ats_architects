import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { hasPermission } from '../../../utils/permissions';
import Button from '../../../components/common/Button';
import api from '../../../services/api';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobPostings, setJobPostings] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [loading, setLoading] = useState(true);

  const canCreateJobs = hasPermission(user?.role, 'job_postings');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await api.get('/jobs');
      console.log('Job postings:', response.data.jobs);
      setJobPostings(response.data.jobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const toggleAccordion = (jobId) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const handleCreateJob = () => {

    navigate('/recruiter/createposting');
    // TODO: Navigate to job creation page
    console.log('Create job clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          <Button 
            onClick={handleLogout}
            variant="secondary"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          {canCreateJobs && (<>
          <p className="text-2xl"></p>
            <Button 
              onClick={handleCreateJob} 
              variant="primary" 
              size="md"
              >
              Create Job Posting
            </Button>
              </>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {jobPostings.map((job) => (
                  <div key={job.jobPostingId} className="border rounded-lg">
                    <div className="flex items-center justify-between p-4 cursor-pointer"
                         onClick={() => toggleAccordion(job.jobPostingId)}>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{job.jobTitle}</span>
                        {expandedJobs[job.jobPostingId] ? 
                          <ChevronUpIcon className="w-5 h-5" /> : 
                          <ChevronDownIcon className="w-5 h-5" />
                        }
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("navigate to applications ");
                          navigate(`/recruiter/applications/${job.jobPostingId}`);
                          
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        View Applications
                      </Button>
                    </div>
                    
                    {expandedJobs[job.jobPostingId] && (
                      <div className="p-4 border-t bg-gray-50">
                        <p className="mb-2"><span className="font-semibold">Description:</span> {job.jobDescription}</p>
                        <p className="mb-2"><span className="font-semibold">Location:</span> {job.location}</p>
                        <p className="mb-2"><span className="font-semibold">Salary Range:</span> {job.salaryRange}</p>
                        <p className="mb-2"><span className="font-semibold">Position:</span> {job.jobPosition}</p>
                        <p className="mb-2"><span className="font-semibold">Posted:</span> {new Date(job.postingDate).toLocaleDateString()}</p>
                        <p className="mb-2"><span className="font-semibold">Application Deadline:</span> {job.applicationEndDate}</p>
                        <p><span className="font-semibold">Requirements:</span> {job.jobRequirements}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import Button from "../../../components/common/Button";
import api from "../../../services/api";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobPostings, setJobPostings] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    canCreateJobs: false,
    canDoDbSeeding: false,
    canHaveInterviews: false,
    canProcessEmails: false,
    canScoreResumes: false,
    canSeeRecuiterDashboard: false,
    canSeeHRDashboard : false,
    canSeeInterviewerDashboard : false
  });
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreMessage, setScoreMessage] = useState(null);
  const [emailProcessing, setEmailProcessing] = useState(false);
  const [emailMessage, setEmailMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setPermissions({
        canCreateJobs: hasPermission(user.role, "job_postings"),
        canDoDbSeeding: hasPermission(user.role, "seeding_db"),
        canHaveInterviews: hasPermission(user.role, "my_interviews"),
        canProcessEmails: hasPermission(user.role, "process_emails"),
        canScoreResumes: hasPermission(user.role, "score_resumes"),
        canHandleAnalytics: hasPermission(user.role, 'handle_analytics'),
        canSeeRecuiterDashboard: hasPermission(user.role, 'Recruiter-dashboard'),
        canSeeHRDashboard: hasPermission(user.role, 'HR-dashboard'),
        canSeeInterviewerDashboard: hasPermission(user.role, 'interviewer-dashboard')
      });
    }
  }, [user]);

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await api.get("/jobs");
      console.log("Job postings:", response.data.jobs);
      setJobPostings(response.data.jobs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const toggleAccordion = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const handleCreateJob = () => {
    navigate("/recruiter/createposting");
    console.log("Create job clicked");
  };

  const handleSeeding = () => {
    
    console.log("user", user);
    navigate("/recruiter/seedDatabase");
  };

  const handleProcessEmails = async () => {
    try {
      setEmailProcessing(true);
      setEmailMessage(null);

      const response = await api.get("/google/process-emails");

      setEmailMessage({
        type: "success",
        text: response.data.message,
      });
    } catch (error) {
      setEmailMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to process emails",
      });
    } finally {
      setEmailProcessing(false);
    }
  };

  const handleMyInterview = () => {
    console.log("user", user);
    navigate("/recruiter/my-interviews");
    console.log("my interviews");
  };

  const handleScoreResumes = async () => {
    try {
      setScoreLoading(true);
      setScoreMessage(null);

      const response = await api.get("/google/update-resume-score");

      setScoreMessage({
        type: "success",
        text: response.data.message,
      });
    } catch (error) {
      setScoreMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to process resumes",
      });
    } finally {
      setScoreLoading(false);
    }
  };

  const handleAnalytics = () => {
    console.log("user", user);
    
    navigate('/recruiter/analytics');
   
    console.log('analytics page');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          
          {permissions.canSeeRecuiterDashboard && (
            <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          )}
          {permissions.canSeeHRDashboard && (
            <h1 className="text-2xl font-bold">HR Dashboard</h1>
          )}
          {permissions.canSeeInterviewerDashboard && (
            <h1 className="text-2xl font-bold">Interviewer Dashboard</h1>
          )}
          <Button onClick={handleLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-4"></div>
        </div>
        <div className="mb-6 flex items-center gap-4">
          {permissions.canCreateJobs && (
            <Button
              onClick={handleCreateJob}
              variant="primary"
              size="md"
            >
              Create Job Posting
            </Button>
          )}

          {permissions.canScoreResumes && (
            <div>
              <Button
                onClick={handleScoreResumes}
                disabled={scoreLoading}
                variant="primary"
                className="flex items-center gap-2"
              >
                {scoreLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing Resumes...
                  </>
                ) : (
                  "Update Resume Scores"
                )}
              </Button>
            </div>
          )}

          {permissions.canDoDbSeeding && (
            <Button onClick={handleSeeding} variant="primary" size="md">
              Seed Database
            </Button>
          )}

          {permissions.canProcessEmails && (
            <div>
              <Button
                onClick={handleProcessEmails}
                variant="primary"
                size="md"
                disabled={emailProcessing}
                className="flex items-center gap-2"
              >
                {emailProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing Emails...
                  </>
                ) : (
                  "Check Email for new Applications"
                )}
              </Button>
            </div>
          )}

            {permissions.canHandleAnalytics && (
              <Button 
              onClick={handleAnalytics} 
              variant="primary" 
              size="md"
              className='ml-4'
              >
                View Analytics
              </Button>
            )}

          {permissions.canHaveInterviews && (
            <Button
              onClick={handleMyInterview}
              variant="secondary"
              size="md"
              className="ml-4"
            >
              My Interviews
            </Button>
          )}
          {scoreMessage && (
            <div
              className={`mt-4 p-4 rounded ${
                scoreMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {scoreMessage.text}
            </div>
          )}
          {emailMessage && (
            <div
              className={`mt-4 p-4 rounded ${
                emailMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {emailMessage.text}
            </div>
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
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => toggleAccordion(job.jobPostingId)}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{job.jobTitle}</span>
                        {expandedJobs[job.jobPostingId] ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("navigate to applications ");
                         

                          navigate(`/recruiter/applications/${job.jobPostingId}`, {
                            state: { jobTitle: job.jobTitle }
                          });
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        View Applications
                      </Button>
                    </div>

                    {expandedJobs[job.jobPostingId] && (
                      <div className="p-4 border-t bg-gray-50">
                        <p className="mb-2">
                          <span className="font-semibold">Description:</span>{" "}
                          {job.jobDescription}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Location:</span>{" "}
                          {job.location}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Salary Range:</span>{" "}
                          {job.salaryRange}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Position:</span>{" "}
                          {job.jobPosition}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">Posted:</span>{" "}
                          {new Date(job.postingDate).toLocaleDateString()}
                        </p>
                        <p className="mb-2">
                          <span className="font-semibold">
                            Application Deadline:
                          </span>{" "}
                          {new Date(
                            job.applicationEndDate
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-semibold">Requirements:</span>{" "}
                          {job.jobRequirements}
                        </p>
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

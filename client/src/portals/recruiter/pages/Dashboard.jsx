// pages/Dashboard/index.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { hasPermission } from "../../../utils/permissions";
import api from "../../../services/api";
import architectsLogo from '../../../assets/architectsLogo.png';

import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardActions from "../components/Dashboard/DashboardActions";
import JobList from "../components/Dashboard/JobList";
import { getInitialPermissions, updatePermissions } from "../../../utils/dashboardUtils";


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobPostings, setJobPostings] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(getInitialPermissions());
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreMessage, setScoreMessage] = useState(null);
  const [emailProcessing, setEmailProcessing] = useState(false);
  const [emailMessage, setEmailMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setPermissions(updatePermissions(user, hasPermission));
    }
  }, [user]);

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const response = await api.get("/jobs");
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
  };

  const handleSeeding = () => {
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
    navigate("/recruiter/my-interviews");
  };

  const handleScoreResumes = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleAnalytics = () => {
    navigate('/recruiter/analytics');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleViewApplications = (jobId, jobTitle) => {
    navigate(`/recruiter/applications/${jobId}`, {
      state: { jobTitle }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        permissions={permissions}
        architectsLogo={architectsLogo}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-4"></div>
        </div>
        
        <DashboardActions 
          permissions={permissions}
          onCreateJob={handleCreateJob}
          onSeeding={handleSeeding}
          onProcessEmails={handleProcessEmails}
          onScoreResumes={handleScoreResumes}
          onAnalytics={handleAnalytics}
          onMyInterview={handleMyInterview}
          scoreLoading={scoreLoading}
          emailProcessing={emailProcessing}
          scoreMessage={scoreMessage}
          emailMessage={emailMessage}
        />

        <div className="grid grid-cols-1 gap-6">
          <JobList
            loading={loading}
            jobPostings={jobPostings}
            expandedJobs={expandedJobs}
            onToggleAccordion={toggleAccordion}
            onViewApplications={handleViewApplications}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
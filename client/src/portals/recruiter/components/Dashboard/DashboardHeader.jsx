// components/Dashboard/DashboardHeader.js
import React from 'react';
import Button from "../../../../components/common/Button";
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ permissions = {}, architectsLogo, onLogout }) => {
  const navigate = useNavigate();

  const getDashboardTitle = () => {
    if (permissions.canSeeRecuiterDashboard) return "Recruiter Dashboard";
    if (permissions.canSeeHRDashboard) return "HR Dashboard";
    if (permissions.canSeeInterviewerDashboard) return "Interviewer Dashboard";
    return "Dashboard"; // default
  };

  return (
    <div className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          

          {/* Logo */}
          <img
            src={architectsLogo}
            alt="ATS Architects Logo"
            className="h-12 w-12 rounded-full object-cover"
          />

          {/* Title */}
          <h1 className="text-2xl font-bold">{getDashboardTitle()}</h1>
        </div>

        {/* Logout Button */}
        <Button onClick={onLogout} variant="secondary" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;


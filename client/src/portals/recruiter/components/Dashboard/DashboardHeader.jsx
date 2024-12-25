// components/Dashboard/DashboardHeader.js
import React from 'react';
import Button from "../../../../components/common/Button";

const DashboardHeader = ({ permissions, architectsLogo, onLogout }) => {
  return (
    <div className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={architectsLogo}
            alt="ATS Architects Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          {permissions.canSeeRecuiterDashboard && (
            <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          )}
          {permissions.canSeeHRDashboard && (
            <h1 className="text-2xl font-bold">HR Dashboard</h1>
          )}
          {permissions.canSeeInterviewerDashboard && (
            <h1 className="text-2xl font-bold">Interviewer Dashboard</h1>
          )}
        </div>
        <Button onClick={onLogout} variant="secondary" size="sm">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
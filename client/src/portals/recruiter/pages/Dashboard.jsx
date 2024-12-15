import React from 'react';

const RecruiterDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Recruiter Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
          {/* List of open job positions */}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Candidate Pipeline</h2>
          {/* Candidate tracking metrics */}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
          {/* Recent job applications */}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
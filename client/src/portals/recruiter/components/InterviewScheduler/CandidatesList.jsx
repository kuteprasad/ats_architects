import React from 'react';

export const CandidatesList = ({ selectedApplications }) => {
  
  console.log(selectedApplications);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Selected Candidates</h2>
      <div className="space-y-2">
        {selectedApplications.map(appId => (
          <div 
            key={appId}
            className="p-3 border rounded"
          >
            <p className="font-medium">Application ID: {appId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
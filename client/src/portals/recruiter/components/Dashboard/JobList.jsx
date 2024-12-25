// components/Dashboard/JobList.js
import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Loading from '../../../../components/common/Loading';
import Button from '../../../../components/common/Button';


const JobList = ({ 
  loading, 
  jobPostings, 
  expandedJobs, 
  onToggleAccordion, 
  onViewApplications 
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
      {loading ? (
        <Loading size="lg" text="Please wait..." />
      ) : (
        <div className="space-y-4">
          {jobPostings.map((job) => (
            <div key={job.jobPostingId} className="border rounded-lg">
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => onToggleAccordion(job.jobPostingId)}
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
                    onViewApplications(job.jobPostingId, job.jobTitle);
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
                    <span className="font-semibold">Application Deadline:</span>{" "}
                    {new Date(job.applicationEndDate).toLocaleDateString()}
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
  );
};

export default JobList;
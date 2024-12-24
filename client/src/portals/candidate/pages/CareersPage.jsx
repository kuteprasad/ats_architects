import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import Loading from '../../../components/common/Loading';
import ErrorMessage from "../../../components/common/ErrorMessage";

const CareersPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs');
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleJobExpansion = (jobId, field) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        [field]: !prev[jobId]?.[field]
      }
    }));
  };

  const renderExpandableText = (text, jobId, field, maxLength = 150) => {
    const isExpanded = expandedJobs[jobId]?.[field];
    if (!text) return null;
    if (text.length <= maxLength) return <p className="text-gray-600">{text}</p>;

    return (
      <div>
        <p className="text-gray-600">
          {isExpanded ? text : `${text.substring(0, maxLength)}...`}
        </p>
        <button
          onClick={() => toggleJobExpansion(jobId, field)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-1"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    );
  };

  if (loading) return <Loading size="lg" text="Please wait..." /> ;
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Careers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.jobPostingId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">{job.jobTitle}</h2>
              <div className="space-y-3 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Position:</span> {job.jobPosition}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {job.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Salary:</span> {job.salaryRange || 'Not specified'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Posted:</span> {new Date(job.postingDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Deadline:</span> {new Date(job.applicationEndDate).toLocaleDateString()}
                </p>
              </div>
              <div className="mb-4">
              <h3 className="font-medium mb-2">Description:</h3>
              {renderExpandableText(job.jobDescription, job.jobPostingId, 'description')}
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Requirements:</h3>
              {renderExpandableText(job.jobRequirements, job.jobPostingId, 'requirements')}
            </div>
              <Button
                onClick={() => navigate(`/candidate/jobs/${job.jobPostingId}`)}
                variant="primary"
                className="w-full mt-4"
              >
                 Apply Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareersPage;
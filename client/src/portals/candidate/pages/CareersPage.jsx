import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const CareersPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

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
                  <span className="font-medium">Deadline:</span> {job.applicationEndDate}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Description:</h3>
                <p className="text-gray-600 line-clamp-3">{job.jobDescription}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Requirements:</h3>
                <p className="text-gray-600 line-clamp-3">{job.jobRequirements}</p>
              </div>
              <Button
                onClick={() => navigate(`/jobs/${job.jobPostingId}`)}
                variant="primary"
                className="w-full mt-4"
              >
                View Details & Apply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareersPage;
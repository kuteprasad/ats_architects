import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/common/Loading";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { ArrowLeft } from "lucide-react";
import architectsLogo from "../../../assets/architectsLogo.png";

const CareersPage = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch jobs");
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleJobExpansion = (jobId, field) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        [field]: !prev[jobId]?.[field],
      },
    }));
  };

  const renderExpandableText = (text, jobId, field, maxLength = 150) => {
    const isExpanded = expandedJobs[jobId]?.[field];
    if (!text) return null;
    if (text.length <= maxLength)
      return <p className="text-gray-600">{text}</p>;

    return (
      <div>
        <p className="text-gray-600">
          {isExpanded ? text : `${text.substring(0, maxLength)}...`}
        </p>
        <button
          onClick={() => toggleJobExpansion(jobId, field)}
          className="text-blue-600 hover:text-blue-800 text-sm mt-1"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      </div>
    );
  };

  if (loading) return <Loading size="lg" text="Please wait..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Left: Logo and Label */}
        <div className="absolute left-0 flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <img
              src={architectsLogo}
              alt="ARchitects Logo"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-blue-600">ARchitects</h1>
              <p className="text-sm text-gray-600">ATS Streamlining System</p>
            </div>
          </div>
        </div>

        {/* Center: Career Opportunities Title */}
        <h2 className="text-xl font-bold text-black text-center">
          Career Opportunities
        </h2>

        {/* Right: Register Button */}
        <div className="absolute right-0">
          <Button
            onClick={() => navigate("/register")}
            variant="primary"
          >
            Register
          </Button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.jobPostingId}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">{job.jobTitle}</h2>
              <div className="space-y-3 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Position:</span>{" "}
                  {job.jobPosition}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span>{" "}
                  {job.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Salary:</span>{" "}
                  {job.salaryRange || "Not specified"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Posted:</span>{" "}
                  {new Date(job.postingDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(job.applicationEndDate).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Description:</h3>
                {renderExpandableText(
                  job.jobDescription,
                  job.jobPostingId,
                  "description"
                )}
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Requirements:</h3>
                {renderExpandableText(
                  job.jobRequirements,
                  job.jobPostingId,
                  "requirements"
                )}
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

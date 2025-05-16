import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { sendThankYouEmail } from "../../../services/emailService";
import Button from "../../../components/common/Button";
import architectsLogo from "../../../assets/architectsLogo.png";
import { useEffect } from "react";
import Loading from "../../../components/common/Loading";
import Input from "../../../components/common/Input";
import Toast from "../../../components/common/Toast";

const ApplicationPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        console.log("Fetching job with ID:", jobId);
        const response = await api.get(`/jobs/${jobId}`);

        console.log("Request done with this content", response.data.job[0]);
        setJob(response.data.job[0]);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch job");
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      const res = await api.post(`/applications/${jobId}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await sendThankYouEmail(res.data.application);

      setMessage({
        type: "success",
        text: "Application submitted and email sent successfully",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to submit application and send email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="relative flex items-center mb-8">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <img src={architectsLogo} alt="ARchitects Logo" className="h-10 w-auto" />
          <div>
            <h1 className="text-lg font-bold text-blue-600">ARchitects</h1>
            <p className="text-xs text-gray-600">ATS Streamlining System</p>
          </div>
        </div>
  
        {/* Center Title */}
        <div className="absolute inset-0 flex justify-center items-center">
          <h2 className="text-2xl font-bold text-black text-center">
            Apply: {job?.title}
          </h2>
        </div>
      </div>
  
      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Application Form */}
        <div className="flex-[2] bg-white p-8 rounded-xl shadow-2xl">
          <div className="w-full">
            {/* Toast-like message for success or error */}
            {message && (
              <div
                className={`border px-4 py-3 rounded mb-4 ${
                  message.type === "success"
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-red-100 border-red-400 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}
  
            <div className="flex items-center justify-center space-x-4 mb-6">
              <img
                src={architectsLogo}
                alt="ATS Architects Logo"
                className="h-16 w-16 rounded-full object-cover transform hover:scale-105 transition-transform duration-200"
              />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Submit Your Application
              </h1>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">Resume</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
  
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                loadingChildren="Submitting..."
              >
                Submit Application
              </Button>
            </form>
          </div>
        </div>
  
        {/* Right Side - Career Opportunity Details */}
        <div className="flex-[1] border rounded-lg p-6 shadow-sm bg-white">
          {job && (
            <>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{job.jobTitle}</h3>
              <p className="text-gray-700 mb-1">
                <strong>Position:</strong> {job.jobPosition}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Salary:</strong> {job.salaryRange}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Posted:</strong> {job.postingDate}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Deadline:</strong> {job.applicationEndDate}
              </p>
  
              <div className="mb-4">
                <h4 className="text-md font-bold text-gray-800">Job Description</h4>
                <p className="text-sm text-gray-700">{job.jobDescription}</p>
              </div>
  
              <div>
                <h4 className="text-md font-bold text-gray-800">Requirements</h4>
                <p className="text-sm text-gray-700">{job.jobRequirements}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
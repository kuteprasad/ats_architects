import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { sendThankYouEmail } from "../../../services/emailService";
import Button from "../../../components/common/Button";
import architectsLogo from "../../../assets/architectsLogo.png";

// Job Details Mapping
const jobDetailsMap = {
  "1": {
    title: "Software Developer",
    position: "Software Developer",
    location: "Bangalore, Karnataka, India",
    salary: "₹8,00,000 - ₹15,00,000 per annum",
    posted: "15/09/2024",
    deadline: "31/12/2025",
    description: "We are looking for a skilled Software Developer to join our team and help build cutting-edge software solutions...",
    requirements: "Proficiency in Java, Python, or C++, experience with Git, and SDLC knowledge.",
  },
  "2": {
    title: "Marketing Manager",
    position: "Marketing Manager",
    location: "Remote or On-site (New York, NY)",
    salary: "₹100000 - ₹120000 per annum",
    posted: "12/11/2024",
    deadline: "22/01/2025",
    description: "We are looking for a dynamic and results-driven Marketing Manager to lead our marketing efforts...",
    requirements: "Bachelor’s degree in Marketing, minimum of 5 years of experience...",
  },
  "3": {
    title: "Cloud Platform Certified Developer",
    position: "Cloud Application Developer",
    location: "Pune ,Maharashtra, India",
    salary: "₹6000 - ₹8000",
    posted: "23/12/2024",
    deadline: "15/01/2025",
    description: "We are seeking a Cloud Platform Certified Developer to design, develop, and deploy scalable cloud-based applications...",
    requirements: "Proven experience in cloud development with certification in AWS, Azure, or Google Cloud...",
  },
  "4": {
    title: "Business Analytics Consultant",
    position: " Business Analytics Consultant",
    location: "Pune,Maharashtra,India",
    salary: "₹6,00,000 - ₹12,00,000 per annum",
    posted: "24/08/2024",
    deadline: "31/12/2025",
    description: "We are seeking a talented and motivated Business Analytics Consultant to join our dynamic team...",
    requirements: "Proficiency in business analytics tools and methodologies, strong communication skills, experience in SQL, Excel, and data visualization tools like Tableau...",
  },
  "5": {
    title: "Successfactor Employee Central Certified Consultant",
    position: "HRIS Analyst",
    location: "Pune,Maharashtra, India",
    salary: "₹7500 - ₹9000",
    posted: "19/08/2024",
    deadline: "30/01/2024",
    description: "We are looking for a detail-oriented HRIS Analyst to manage and optimize our HRIS...",
    requirements: "Experience with SAP SuccessFactors, Workday, or ADP...",
  },
};

const ApplicationPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const jobInfo = jobDetailsMap[jobId];

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
            Apply: {jobInfo?.title}
          </h2>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - Application Form */}
        <div className="w-full lg:w-1/2">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {["firstName", "lastName", "email", "phoneNumber"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "email" ? "email" : field === "phoneNumber" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="button"
                disabled={loading}
                variant="secondary"
                onClick={() => navigate(-1)}  // Go back functionality using navigate(-1)
              >
                {loading ? "Wait ..." : "Go Back"}
              </Button>
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side - Career Opportunity Details */}
        {jobInfo && (
          <div className="w-full lg:w-1/2 border rounded-lg p-6 shadow-sm bg-white">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{jobInfo.title}</h3>
            <p className="text-gray-700 mb-1"><strong>Position:</strong> {jobInfo.position}</p>
            <p className="text-gray-700 mb-1"><strong>Location:</strong> {jobInfo.location}</p>
            <p className="text-gray-700 mb-1"><strong>Salary:</strong> {jobInfo.salary}</p>
            <p className="text-gray-700 mb-1"><strong>Posted:</strong> {jobInfo.posted}</p>
            <p className="text-gray-700 mb-4"><strong>Deadline:</strong> {jobInfo.deadline}</p>

            <div className="mb-4">
              <h4 className="text-md font-bold text-gray-800">Job Description</h4>
              <p className="text-sm text-gray-700">{jobInfo.description}</p>
            </div>

            <div>
              <h4 className="text-md font-bold text-gray-800">Requirements</h4>
              <p className="text-sm text-gray-700">{jobInfo.requirements}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;


import React, { useState } from 'react';
import Input from '../../../components/common/Input';
import Toast from '../../../components/common/Toast';
import { useNavigate } from 'react-router-dom';
import architectsLogo from '../../../assets/architectsLogo.png';
import Button from '../../../components/common/Button';
import api from '../../../services/api';

const CreatePosting = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    location: '',
    salaryRange: '',
    jobPosition: '',
    applicationEndDate: '',
    jobRequirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/jobs', formData);
      showToast('Job posting created successfully! Redirecting to Home page...', 'success');

      setTimeout(() => {
        navigate('/recruiter/dashboard');
      }, 5000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error creating job posting';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Dummy logout handler (you should implement real logout logic)
  const onLogout = () => {
    // Clear tokens, etc.
    navigate('/login');
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <img
              src={architectsLogo}
              alt="ATS Architects Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold">Create Job Posting</h1>
          </div>
          <Button onClick={onLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
          {toast.show && (
            <div className="fixed top-4 right-4 z-50">
              <Toast
                message={toast.message}
                type={toast.type}
                duration={5000}
                onClose={() => setToast({ ...toast, show: false })}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              name="jobTitle"
              type="text"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
            <Input
              name="jobDescription"
              type="text"
              placeholder="Job Description"
              value={formData.jobDescription}
              isTextArea
              onChange={handleChange}
              required
            />
            <Input
              name="location"
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <Input
              name="salaryRange"
              type="text"
              placeholder="Salary Range"
              value={formData.salaryRange}
              onChange={handleChange}
              required
            />
            <Input
              name="jobPosition"
              type="text"
              placeholder="Job Position"
              value={formData.jobPosition}
              onChange={handleChange}
              required
            />
            <Input
              name="applicationEndDate"
              type="date"
              placeholder="Application End Date"
              value={formData.applicationEndDate}
              onChange={handleChange}
              required
            />
            <Input
              name="jobRequirements"
              type="text"
              placeholder="Job Requirements"
              value={formData.jobRequirements}
              isTextArea
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              loadingChildren="Creating..."
            >
              Create Posting
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePosting;

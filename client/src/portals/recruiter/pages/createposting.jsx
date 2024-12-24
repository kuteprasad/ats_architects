import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import architectsLogo from '../../../assets/architectsLogo.png';

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
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("formData: ", formData);
      // const response = await api.post('/jobs', formData);
      // console.log('Job posting created:', response.data);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <img
            src={architectsLogo}
            alt="ATS Architects Logo"
            className="h-16 w-16 rounded-full object-cover transform hover:scale-105 transition-transform duration-200"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Create Job Posting
          </h1>
        </div>

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
            onChange={handleChange}
            required
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

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
  );
};

export default CreatePosting;
import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useNavigate } from 'react-router-dom';
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
      const response = await api.post('/jobs', formData);
      console.log('Job posting created:', response.data);
      setLoading(false);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating job posting');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Job Posting
        </h2>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
          <Input
            label="Job Description"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            required
            isTextArea
          />
          <Input
            label="Job Requirements"
            name="jobRequirements"
            value={formData.jobRequirements}
            onChange={handleChange}
            required
            isTextArea
          />
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            isTextArea
          />
          <Input
            label="Application End Date"
            type="date"
            name="applicationEndDate"
            value={formData.applicationEndDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Salary Range"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            required
          />
          <Input
            label="Job Position"
            name="jobPosition"
            value={formData.jobPosition}
            onChange={handleChange}
            required
          />
          <div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            variant="primary"
          >
            {loading ? 'Creating...' : 'Create Job Posting'}
          </Button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePosting;
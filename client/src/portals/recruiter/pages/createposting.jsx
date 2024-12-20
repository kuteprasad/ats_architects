import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { useNavigate } from 'react-router-dom';

const CreatePosting = () => {
  const [postData, setFormData] = useState({
    jobTitle: '',
    location: '',
    jobDescription: '',
    jobRequirements: '',
    salary: '',
    endDate: ''
  })

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add code to send jobPosting to the server or API
    try {
          console.log("Job Posting Data:  ", postData);
          
        } catch (err) {
          setError(err.message || 'Error while creating Post');
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="Job Title"
            name="jobTitle"
            value={postData.jobTitle}
            onChange={handleChange}
            required
          />
          <Input
            label="Job Description"
            name="jobDescription"
            value={postData.jobDescription}
            onChange={handleChange}
            required
            isTextArea
          />
          <Input
            label="Job Requirements"
            name="jobRequirements"
            value={postData.jobRequirements}
            onChange={handleChange}
            required
            isTextArea
          />
          <Input
            label="Location"
            name="location"
            value={postData.location}
            onChange={handleChange}
            required
            isTextArea
          />
          <Input
            label="Application End Date"
            type="date"
            name="endDate"
            value={postData.endDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Salary"
            name="salary"
            value={postData.salary}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">
             Create Post
           </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePosting;
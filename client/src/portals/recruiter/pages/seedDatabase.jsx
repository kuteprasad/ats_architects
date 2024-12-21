import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { hasPermission } from '../../../utils/permissions';
import Button from '../../../components/common/Button';
import api from '../../../services/api';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

const SeedDatabase = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobPostings, setJobPostings] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [loading, setLoading] = useState(true);

  const canCreateJobs = hasPermission(user?.role, 'job_postings');

  const handleCreateTable = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleInsertTable = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Seed Database</h1>
          <Button 
            onClick={handleCreateTable}
            variant="secondary"
            size="sm"
          >
            Delete table
          </Button>
          <Button 
            onClick={handleDeleteTable}
            variant="secondary"
            size="sm"
          >
            Insert table
          </Button>
          <Button 
            onClick={handleInsertTable}
            variant="secondary"
            size="sm"
          >
            Create table
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeedDatabase;
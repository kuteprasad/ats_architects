import React, { useState } from 'react';
import axios from 'axios';

import Button from '../../../components/common/Button';
import api from '../../../services/api';

const SeedDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateTable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seedDatabase/create');
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating tables');
    } finally {
      setLoading(false);
    }
  };

  const handleInsertTable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seedDatabase/insert');
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error inserting data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/seedDatabase/delete');
      
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting tables');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Seed Database</h1>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <Button
            onClick={handleCreateTable}
            disabled={loading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Create Tables
          </Button>
          <Button
            onClick={handleInsertTable}
            disabled={loading}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Insert Data
          </Button>
          <Button
            onClick={handleDeleteTable}
            disabled={loading}
            variant="danger"
            size="lg"
            className="w-full"
          >
            Delete Tables
          </Button>
        </div>
        {message && (
          <div className="mt-4 p-4 rounded bg-gray-100">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedDatabase;
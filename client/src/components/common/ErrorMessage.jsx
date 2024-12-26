import React from 'react';
import { ExclamationCircleIcon, ArrowLeftIcon, HomeIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';

const ErrorMessage = ({ message }) => {
  const navigate = useNavigate();

//   if (!message) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-500">
        <div className="flex items-center justify-center space-x-3">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-semibold text-gray-800">Something Went Wrong</h1>
        </div>
        <div className="text-center mt-4">
          <p className="text-lg font-medium text-red-600">{message && message}</p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-green-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-800 transition transform hover:scale-105 focus:outline-none"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition transform hover:scale-105 focus:outline-none"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

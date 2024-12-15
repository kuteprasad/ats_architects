import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-9xl font-bold text-blue-500 mb-4 transition-transform duration-300 hover:scale-105">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for seems to have wandered off.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/login" 
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            <Home className="mr-2" size={20} />
            Go to login
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
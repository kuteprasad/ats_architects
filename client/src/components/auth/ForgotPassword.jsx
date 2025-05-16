import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


function ForgotPassword() {
    const [email, setEmail] = useState();
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault()
        
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
          <h4 className="text-2xl font-bold text-blue-800 text-center">
            Forgot Password
          </h4>
          <p className="text-sm text-gray-500 text-center">
            Enter your email address, and we’ll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="rounded-md shadow-sm">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Send
            </button>
          </form>
          <p className="text-sm text-gray-500 text-center mt-4">
            Remembered your password?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
      
    )
}

export default ForgotPassword;
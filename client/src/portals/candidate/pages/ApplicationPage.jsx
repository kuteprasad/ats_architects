import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import {  sendThankYouEmail } from "../../../services/emailService";
import Button from "../../../components/common/Button";

const ApplicationPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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

    console.log("ksdfjs ", formData);

    try {
      const formPayload = new FormData();
      formPayload.append("firstName", formData.firstName);
      formPayload.append("lastName", formData.lastName);

      formPayload.append("email", formData.email);
      formPayload.append("phoneNumber", formData.phoneNumber);
      formPayload.append("resume", formData.resume);

      console.log("formpayload : ", formData);

      const res = await api.post(`/applications/${jobId}`, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Extract email data from response
      const emailData = res.data.application;
      console.log("emailData : ", emailData);

      // Send thank you email
     const response = await sendThankYouEmail(emailData);
     console.log("response from sendEmail :", response);

      setMessage({ type: 'success', text: 'Application submitted and email sent successfully' });
      
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to submit application and send email",
      });
     
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Application</h1>

      {message && (
        <div className={`border px-4 py-3 rounded mb-4 ${message.type === "success" ? "bg-green-100  border-green-400 text-green-700 " : "bg-red-100  border-red-400 text-red-700 "}`}>
          {message.text}
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resume
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full"
          />
        </div>

        <Button
          type="button"
          disabled={loading}
          variant="primary"
          onClick={() => navigate("/candidate/careers")}
          // className="w-full"
        >
          {loading ? "wait ..." : "Go Back"}
        </Button>
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          // className="w-full"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default ApplicationPage;

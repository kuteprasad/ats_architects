import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Loading from "../../../components/common/Loading";
import architectsLogo from "../../../assets/architectsLogo.png";
import Button from "../../../components/common/Button"; // Ensure this path is correct

const CandidateHistory = () => {
  const [candidateHistory, setCandidateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const navigate = useNavigate();

  const onLogout = () => {
    // Clear user session data (e.g., tokens)
    localStorage.removeItem("authToken"); // Adjust based on your auth implementation
    navigate("/login"); // Redirect to login page
  };

  const handleViewApplications = (candidateId) => {
    const candidate = candidateHistory.find((c) => c.candidateId === candidateId);
    setSelectedCandidate(candidate);
    console.log("View Applications for Candidate:", candidate);
  };

  const fetchCandidateHistory = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidateHistory(response.data);
      console.log("Candidate History:", response.data);
    } catch (error) {
      console.error("Error fetching candidate history:", error);
      toast.error("Unable to get Candidate Data", {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateHistory();
  }, []);

  if (loading) return <Loading size="lg" text="Fetching Candidates ..." />;

  return (
    <>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img
              src={architectsLogo}
              alt="ATS Architects Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-2xl text-right">
              <span className="font-bold">Candidate History</span>
            </h1>
          </div>
          <Button onClick={onLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 mb-4">
            
          </div>
        </div>
        <div className="row">
          {/* Left Half - Candidate Table */}
          <div className="col-md-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidateHistory.map((candidate, index) => (
                      <tr key={candidate.candidateId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="ml-2 text-sm text-gray-500">{index + 1}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {`${candidate.firstName} ${candidate.lastName}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{candidate.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{candidate.count}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() => handleViewApplications(candidate.candidateId)}
                          >
                            View Applications
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Half - Applications */}
          <div className="col-md-6">
            {selectedCandidate ? (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-4">{`${selectedCandidate.firstName} ${selectedCandidate.lastName}'s Applications`}</h2>
                <ul className="space-y-3">
                  {selectedCandidate.applications && selectedCandidate.applications.length > 0 ? (
                    selectedCandidate.applications.map((application, idx) => (
                      <li key={idx} className="p-3 bg-gray-100 rounded-md shadow-sm">
                        <p className="text-sm text-gray-600">Application ID: {application.applicationId}</p>
                        <p className="text-sm text-gray-600">Date: {application.applicationDate}</p>
                        <p className="text-sm text-gray-600">Status: {application.applicationStatus}</p>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No applications available for this candidate.</p>
                  )}
                </ul>
              </div>
            ) : (
              <div className="text-gray-500 text-center mt-5">
                <p>Select a candidate to view their applications.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateHistory;




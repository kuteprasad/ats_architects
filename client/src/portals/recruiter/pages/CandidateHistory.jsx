import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Loading from "../../../components/common/Loading";
import { X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import architectsLogo from '../../../assets/architectsLogo.png';
import Button from "../../../components/common/Button";
import DashboardHeader from '../components/Dashboard/DashboardHeader';

const CandidateHistory = () => {
  const [candidateHistory, setCandidateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleViewApplications = (candidateId) => {
    const candidate = candidateHistory.find((c) => c.candidateId === candidateId);
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
  };

  const fetchCandidateHistory = async () => {
    try {
      const response = await api.get('/candidates');
      setCandidateHistory(response.data);
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

    const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    fetchCandidateHistory();
  }, []);

  if (loading) return <Loading size="lg" text="Fetching Candidates ..." />;
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <img
              src={architectsLogo}
              alt="ATS Architects Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold">Candidate History</h1>
          </div>
          <Button onClick={handleLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>
      </div>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate History</h1> */}
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidateHistory.map((candidate, index) => (
                  <tr key={candidate.candidateId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${candidate.firstName} ${candidate.lastName}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{candidate.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{candidate.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {candidate.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewApplications(candidate.candidateId)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {`${selectedCandidate.firstName} ${selectedCandidate.lastName}'s Applications`}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedCandidate.applications && selectedCandidate.applications.length > 0 ? (
                <div className="grid gap-4">
                  {selectedCandidate.applications.map((application, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Job Details Section */}
                      <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                        <h3 className="text-md font-semibold text-blue-900 mb-2">{application.jobTitle}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-blue-700">
                            <span className="font-medium">Position:</span> {application.jobPosition}
                          </p>
                          <p className="text-blue-700">
                            <span className="font-medium">Location:</span> {application.location}
                          </p>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Application ID</p>
                          <p className="text-sm text-gray-900">{application.applicationId}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p className="text-sm text-gray-900">
                            {new Date(application.applicationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Status</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            application.applicationStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            application.applicationStatus === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.applicationStatus}
                          </span>
                        </div>
                        {application.resumeScore && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Resume Score</p>
                            <p className="text-sm text-gray-900">{application.resumeScore}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No applications available for this candidate.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default CandidateHistory;
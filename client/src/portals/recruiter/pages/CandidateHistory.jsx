import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Loading from "../../../components/common/Loading";

const CandidateHistory = () => {
  const [candidateHistory, setCandidateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleViewApplications = (candidateId) => {
    const candidate = candidateHistory.find((c) => c.candidateId === candidateId);
    setSelectedCandidate(candidate);
    console.log("View Applications for Candidate:", candidate);
  };

  const fetchCandidateHistory = async () => {
    try {
      const response = await api.get("/candidates");
      setCandidateHistory(response.data);
      console.log("Candidate History:", response.data);
    } catch (error) {
      console.error("Error fetching candidate history:", error);
      toast.error(`Unable to get Candidate Data`, {
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

  if (loading)
    return <Loading size="lg" text="Fetching Candidates ..." />;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 mb-4">
          <h1 className="text-center text-2xl font-bold">Candidate History</h1>
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
                      {/* <p className="text-sm text-gray-600">Application For: {application.jobPostingId}</p> */}
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
  );
};

export default CandidateHistory;

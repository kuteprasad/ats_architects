import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import Button from "../../../components/common/Button";

const ApplicationsPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/applications/${jobId}`);
        if (isMounted) {
          setApplications(response.data.applications);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response?.data?.message || "Failed to fetch applications");
          setApplications([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const toggleCandidateSelection = (applicationId) => {
    setSelectedCandidates((prev) => ({
      ...prev,
      [applicationId]: !prev[applicationId],
    }));
  };

  const handleSendInterviewInvites = async () => {
    const selectedIds = Object.keys(selectedCandidates).filter(
      (id) => selectedCandidates[id]
    );
    try {
      await api.post("/applications/send-invites", {
        applicationIds: selectedIds,
        jobId,
      });
      alert("Interview invites sent successfully!");
    } catch (error) {
      console.error("Error sending invites:", error);
      alert("Failed to send interview invites");
    }
  };

  const selectedCount =
    Object.values(selectedCandidates).filter(Boolean).length;

  if (loading) return <div className="p-6">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applications for Job ID: {jobId}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Selected: {selectedCount} candidates</span>
          <Button
            onClick={handleSendInterviewInvites}
            disabled={selectedCount === 0}
            variant="primary"
          >
            Send Interview Invites
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Select
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Candidate Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Application Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Resume Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Resume
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application.applicationId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      selectedCandidates[application.applicationId] || false
                    }
                    onChange={() =>
                      toggleCandidateSelection(application.applicationId)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {application.candidateName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {application.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(application.applicationDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {application.resumeScore}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    onClick={() => {
                      const blob = new Blob([application.resume], {
                        type: "application/pdf",
                      });
                      const url = window.URL.createObjectURL(blob);
                      window.open(url);
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    View Resume
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsPage;

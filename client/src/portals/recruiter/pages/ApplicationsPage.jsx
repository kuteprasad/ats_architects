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
  const [filters, setFilters] = useState({
    dateRange: {
      start: "",
      end: "",
    },
    minScore: "",
    maxScore: "",
    limit: "",
  });

  // Add state for select all
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/applications/${jobId}`);
        if (isMounted) {
          console.log("resp ", response.data);
          setApplications(response.data.applications);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error.response?.data?.message || "Failed to fetch applications"
          );
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

  // Add toggle function for select all
  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    const newSelectedState = {};
    filteredApplications.forEach((app) => {
      newSelectedState[app.applicationId] = !selectAll;
    });
    setSelectedCandidates(newSelectedState);
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

  const handleViewResume = (resumeData) => {
    try {
      // Convert BLOB data to Uint8Array
      const uint8Array = new Uint8Array(resumeData.data);

      // Create Blob object
      const blob = new Blob([uint8Array], {
        type: "application/pdf",
      });

      // Create URL for blob
      const url = window.URL.createObjectURL(blob);

      // Open in new window
      window.open(url);

      // Clean up URL object
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error viewing resume:", error);
      alert("Failed to load resume");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name]: value,
      },
    }));
  };

  const applyFilters = (applications) => {
    return applications
      .filter((app) => {
        const date = new Date(app.applicationDate);
        const score = parseFloat(app.resumeScore);

        // Date range filter
        if (filters.dateRange.start && date < new Date(filters.dateRange.start))
          return false;
        if (filters.dateRange.end && date > new Date(filters.dateRange.end))
          return false;

        // Score range filter
        if (filters.minScore && score < parseFloat(filters.minScore))
          return false;
        if (filters.maxScore && score > parseFloat(filters.maxScore))
          return false;

        return true;
      })
      .slice(0, filters.limit ? parseInt(filters.limit) : undefined);
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: "",
        end: "",
      },
      minScore: "",
      maxScore: "",
      limit: "",
    });
  };

  const filteredApplications = applyFilters(applications);

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

      {/* Filter Section */}
      <div className="bg-white p-4 mb-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <input
              type="date"
              name="start"
              value={filters.dateRange.start}
              onChange={handleDateRangeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="date"
              name="end"
              value={filters.dateRange.end}
              onChange={handleDateRangeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Resume Score Range
            </label>
            <input
              type="number"
              name="minScore"
              placeholder="Min Score"
              value={filters.minScore}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="number"
              name="maxScore"
              placeholder="Max Score"
              value={filters.maxScore}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Limit Results
            </label>
            <input
              type="number"
              name="limit"
              placeholder="Number of results"
              value={filters.limit}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              onClick={resetFilters}
              variant="secondary"
              size="sm"
              className="w-full mt-2"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Select All</span>
                </div>
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
            {filteredApplications.map((application) => (
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
                    onClick={() => handleViewResume(application.resume)}
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

import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { FaChartLine, FaChartPie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import architectsLogo from '../../../assets/architectsLogo.png';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationsMonthly, setApplicationsMonthly] = useState([]);
  const [topJobPostings, setTopJobPostings] = useState([]);
  const [jobPostingsMonthly, setJobPostingsMonthly] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchApplicationsMonthly(),
          fetchTopJobPostings(),
          fetchJobPostingsMonthly(),
          fetchApplicationStatusBreakdown()
        ]);
      } catch (err) {
        setError(err.message || 'Error loading analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const fetchApplicationsMonthly = async () => {
    const { data } = await api.get('/analytics/applications-monthly');
    setApplicationsMonthly(data);
  };

  const fetchTopJobPostings = async () => {
    const { data } = await api.get('/analytics/top-job-postings');
    setTopJobPostings(data);
  };

  const fetchJobPostingsMonthly = async () => {
    const { data } = await api.get('/analytics/job-postings-monthly');
    setJobPostingsMonthly(data);
  };

  const fetchApplicationStatusBreakdown = async () => {
    const { data } = await api.get('/analytics/application-status-breakdown');
    setApplicationStatus(data);
  };

  const chartData = {
    applicationsMonthly: {
      labels: applicationsMonthly.map(item => item.month),
      datasets: [{
        label: 'Applications',
        data: applicationsMonthly.map(item => item.total),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    jobPostingsMonthly: {
      labels: jobPostingsMonthly.map(item => item.month),
      datasets: [{
        label: 'Job Postings',
        data: jobPostingsMonthly.map(item => item.total),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    },
    applicationStatusChartData: {
      labels: applicationStatus.map(item => item.applicationStatus),
      datasets: [{
        data: applicationStatus.map(item => item.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }]
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  if (loading) {
    return <Loading size="lg" text="Please wait..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Analytics</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Placeholder jobTitle & logout handler (customize as needed)
  const jobTitle = "All Jobs";
  const onLogout = () => {
    // Implement your logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img src={architectsLogo} alt="ATS Architects Logo"
              className="h-12 w-12 rounded-full object-cover" />
            <h1 className="text-2xl text-right">
               <span className="font-bold">{jobTitle}</span>
            </h1>
          </div>
          <Button onClick={onLogout} variant="secondary" size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Monthly Applications</h2>
            </div>
            <div className="h-64">
              <Line data={chartData.applicationsMonthly} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaChartPie className="text-orange-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Monthly Job Postings</h2>
            </div>
            <div className="h-64">
              <Line data={chartData.jobPostingsMonthly} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
            <div className="flex items-center mb-4">
              <FaChartPie className="text-green-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Application Status</h2>
            </div>
            <div className="h-64">
              <Pie
                data={chartData.applicationStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        font: { size: 12 }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

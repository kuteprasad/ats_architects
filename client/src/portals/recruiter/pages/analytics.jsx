import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import api from '../../../services/api';

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
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const fetchApplicationsMonthly = async () => {
        try {
            const { data } = await api.get('/analytics/applications-monthly');
            setApplicationsMonthly(data);
        } catch (error) {
            console.error('Error fetching monthly applications:', error);
            throw error;
        }
    };

    const fetchTopJobPostings = async () => {
        try {
            const { data } = await api.get('/analytics/top-job-postings');
            setTopJobPostings(data);
        } catch (error) {
            console.error('Error fetching top job postings:', error);
            throw error;
        }
    };

    const fetchJobPostingsMonthly = async () => {
        try {
            const { data } = await api.get('/analytics/job-postings-monthly');
            setJobPostingsMonthly(data);
        } catch (error) {
            console.error('Error fetching monthly job postings:', error);
            throw error;
        }
    };

    const fetchApplicationStatusBreakdown = async () => {
      try {
          const { data } = await api.get('analytics/application-status-breakdown');
          setApplicationStatus(data);
      } catch (error) {
          console.error('Error fetching application status breakdown:', error);
      }
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
        topJobPostings: {
            labels: topJobPostings.map(item => item.jobTitle),
            datasets: [{
                label: 'Applications per Job',
                data: topJobPostings.map(item => item.totalApplications),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
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
        applicationStatusChartData : {
          labels: applicationStatus.map(item => item.applicationStatus),
          datasets: [
              {
                  data: applicationStatus.map(item => item.total),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each status
                  hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
          ],
      }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-lg p-6 h-80">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
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

    return (
        <div className="min-h-screen bg-gray-50 p-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <FaChartLine className="text-blue-600 text-xl mr-2" />
                        <h2 className="text-xl font-semibold">Monthly Applications</h2>
                    </div>
                    <div className="h-64">
                        <Line data={chartData.applicationsMonthly} options={options} />
                    </div>
                </div>

                {/* <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <FaChartBar className="text-purple-600 text-xl mr-2" />
                        <h2 className="text-xl font-semibold">Top Job Postings</h2>
                    </div>
                    <div className="h-64">
                        <Bar data={chartData.topJobPostings} options={options} />
                    </div>
                </div> */}

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                        <FaChartPie className="text-orange-600 text-xl mr-2" />
                        <h2 className="text-xl font-semibold">Monthly Job Postings</h2>
                    </div>
                    <div className="h-64">
                        <Line data={chartData.jobPostingsMonthly} options={options} />
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
    );
};

export default Analytics;
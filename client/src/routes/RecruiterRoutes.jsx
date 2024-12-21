import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROLES } from '../utils/permissions';
import PrivateRoute from './PrivateRoute';
import RecruiterDashboard from '../portals/recruiter/pages/Dashboard';
import CreatePosting from '../portals/recruiter/pages/createposting';
import ApplicationsPage from '../portals/recruiter/pages/ApplicationsPage';
import InterviewSchedular from '../portals/recruiter/pages/InterviewSchedular';

const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.INTERVIEWER]} />}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="createposting" element={<CreatePosting />} />
        <Route path="seeddatabase" element={<CreatePosting />} />
        <Route path="applications/:jobId" element={<ApplicationsPage />} />
        <Route path="interview-schedular" element={<InterviewSchedular />} />
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
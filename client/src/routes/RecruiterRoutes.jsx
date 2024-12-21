import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { ROLES } from '../utils/permissions';
import RecruiterDashboard from '../portals/recruiter/pages/Dashboard';
import ApplicationsPage from '../portals/recruiter/pages/ApplicationsPage';
import CreatePosting from '../portals/recruiter/pages/createposting';
const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="createposting" element={<CreatePosting />} />
        <Route path="applications/:jobId" element={<ApplicationsPage />} />
        
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
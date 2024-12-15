import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { ROLES } from '../utils/permissions';
import RecruiterDashboard from '../portals/recruiter/pages/Dashboard';

const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[ROLES.RECRUITER]} />}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        {/* Add more recruiter-specific routes */}
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
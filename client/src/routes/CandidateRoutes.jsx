import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { ROLES } from '../utils/permissions';
import CandidateDashboard from '../portals/candidate/pages/Dashboard';

const CandidateRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[ROLES.CANDIDATE]} />}>
        <Route path="dashboard" element={<CandidateDashboard />} />
        {/* Add more candidate-specific routes */}
      </Route>
    </Routes>
  );
};

export default CandidateRoutes;
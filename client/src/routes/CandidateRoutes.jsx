import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CareersPage from '../portals/candidate/pages/CareersPage';
import ApplicationPage from '../portals/candidate/pages/ApplicationPage';


const CandidateRoutes = () => {
  return (
    <Routes>
      <Route >
        <Route path="careers" element={<CareersPage />} />
        <Route path="jobs/:jobId" element={<ApplicationPage />} />
      </Route>
    </Routes>
  );
};

export default CandidateRoutes;
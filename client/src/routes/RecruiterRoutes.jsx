import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROLES } from '../utils/permissions';
import PrivateRoute from './PrivateRoute';
import RecruiterDashboard from '../portals/recruiter/pages/Dashboard';
import CreatePosting from '../portals/recruiter/pages/createposting';
import ApplicationsPage from '../portals/recruiter/pages/ApplicationsPage';
import InterviewSchedular from '../portals/recruiter/pages/InterviewSchedular';
import Analytics from '../portals/recruiter/pages/analytics';
import SeedDatabase from '../portals/recruiter/pages/seedDatabase';
import MyInterviews from '../portals/recruiter/pages/MyInterviews';
import SendEmail from '../pages/SendEmail';
import CandidateHistory from '../portals/recruiter/pages/CandidateHistory';

const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.INTERVIEWER, ROLES.HR]} />}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="createposting" element={<CreatePosting />} />
        <Route path="seedDatabase" element={<SeedDatabase />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="applications/:jobId" element={<ApplicationsPage />} />
        <Route path="interview-schedular" element={<InterviewSchedular />} />
        <Route path="my-interviews" element={<MyInterviews/>} />
        <Route path="candidateHistory" element={<CandidateHistory/>} />
        <Route path="test" element={<SendEmail/>} />
       
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
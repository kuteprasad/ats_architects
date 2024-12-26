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
import CreateMeeting from '../pages/CreateMeeting';
import GetEmails from '../pages/GetEmails';
import MyInterviews from '../portals/recruiter/pages/MyInterviews';


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
        <Route path="test" element={<GetEmails/>} />
       
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
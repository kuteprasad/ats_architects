import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROLES } from '../utils/permissions';
import PrivateRoute from './PrivateRoute';
import RecruiterDashboard from '../portals/recruiter/pages/Dashboard';
import CreatePosting from '../portals/recruiter/pages/createposting';
import ApplicationsPage from '../portals/recruiter/pages/ApplicationsPage';
import InterviewSchedular from '../portals/recruiter/pages/InterviewSchedular';
import MyInterviews from '../portals/recruiter/pages/MyInterviews';
import SeedDatabase from '../portals/recruiter/pages/seedDatabase';
import CreateMeeting from '../pages/CreateMeeting';
import GetEmails from '../pages/GetEmails';


const RecruiterRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute allowedRoles={[ROLES.ADMIN, ROLES.INTERVIEWER]} />}>
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="createposting" element={<CreatePosting />} />
        <Route path="seedDatabase" element={<SeedDatabase />} />
        <Route path="applications/:jobId" element={<ApplicationsPage />} />
        <Route path="interview-schedular" element={<InterviewSchedular />} />
        <Route path="my-interviews" element={<MyInterviews/>} />
        <Route path="test" element={<GetEmails/>} />
       
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CandidateRoutes from './routes/CandidateRoutes';
import RecruiterRoutes from './routes/RecruiterRoutes';
import Login from './components/auth/LoginForm';
import NotFound from './portals/shared/NotFound';
import RegistrationForm from './components/auth/RegistrationForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/candidate/*" element={<CandidateRoutes />} />
          <Route path="/recruiter/*" element={<RecruiterRoutes />} />
          <Route path="/unauthorized" element={<div>unauthorized</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
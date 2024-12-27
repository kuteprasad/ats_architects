import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import CandidateRoutes from './routes/CandidateRoutes';
import RecruiterRoutes from './routes/RecruiterRoutes';
import Login from './components/auth/LoginForm';
import NotFound from './portals/shared/NotFound';
import RegistrationForm from './components/auth/RegistrationForm';
import { Toaster } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import RefreshHandler from './RefreshHandler';

function App() {

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <Router>
      <RefreshHandler setIsAuthenticated = {setIsAuthenticated}/>
        <Toaster />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/candidate/*" element={<CandidateRoutes />} />
            <Route path="/recruiter/*" element={<PrivateRoute element = {<RecruiterRoutes/>} />} />
            <Route path="/unauthorized" element={<div>unauthorized</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
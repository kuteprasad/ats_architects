import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/auth/LoginForm';
import Register from '../components/auth/RegistrationForm';
import PrivateRoute from './PrivateRoute';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<Register />} />
      {/* Add more public routes as needed */}
    </Routes>
  );
};

export default MainRoutes;
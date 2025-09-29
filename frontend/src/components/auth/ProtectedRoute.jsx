import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  if (!authAPI.isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
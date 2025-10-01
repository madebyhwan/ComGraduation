import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../api/http';

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem('authUser');
  const token = localStorage.getItem('authToken');
  if (!auth || !token || isTokenExpired(token)) {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage message="Verifying session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
            <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Access Restricted</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Your current account role (<strong>{userRole}</strong>) does not have permission to view this section.
            </p>
            <a href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Return to Home
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

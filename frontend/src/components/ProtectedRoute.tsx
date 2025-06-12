import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>; // Or a more sophisticated loading spinner
  }

  if (!user) {
    // user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute; 
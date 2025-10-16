import React from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuthContext } from '../contexts/AuthContext';

export const AuthenticatedUserRouteWrapper: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

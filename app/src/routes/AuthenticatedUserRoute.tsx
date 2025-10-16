import React from 'react';
import { Navigate, Route, type RouteProps } from 'react-router';

import { useAuth } from '../hooks/useAuth';

const AuthenticatedUserRoute: React.FC<RouteProps> = (props) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Route {...props} />;
};

export default AuthenticatedUserRoute;

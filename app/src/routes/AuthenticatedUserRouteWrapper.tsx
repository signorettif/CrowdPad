import React, { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router';

import { useAuthContext } from '../contexts/AuthContext';

export const AuthenticatedUserRouteWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children};</>;
};

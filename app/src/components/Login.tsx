import React from 'react';
import { Auth } from './Auth';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleAuthenticate = (username: string, secretKey: string) => {
    login(username, secretKey);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <Auth onAuthenticate={handleAuthenticate} />
      </div>
    </div>
  );
};

export default Login;

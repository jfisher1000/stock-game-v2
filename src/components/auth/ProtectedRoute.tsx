import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  if (!user) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the child components
  return <Outlet />;
};

export default ProtectedRoute;

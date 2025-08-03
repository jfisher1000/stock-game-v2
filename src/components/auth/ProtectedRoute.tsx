import { useAuthStore } from '@/store/auth';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Use the hook from your Zustand store
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    // You can replace this with a dedicated loading spinner component
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after they log in.
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

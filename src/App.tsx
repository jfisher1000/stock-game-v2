import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

// Layouts
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Hooks
import useIdleTimer from './hooks/useIdleTimer';

// A component to handle routes that require authentication
const ProtectedRoutes = () => {
  const { user } = useAuthStore();
  return user ? <AppLayout /> : <Navigate to="/login" replace />;
};

// A component to handle routes that should only be accessible to unauthenticated users
const PublicRoutes = () => {
  const { user } = useAuthStore();
  return user ? <Navigate to="/" replace /> : <AuthLayout />;
};

function App() {
  const { setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  useIdleTimer();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        clearUser();
      }
      setIsLoading(false); // Auth check is complete, stop loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, clearUser]);

  // Display a loading indicator while Firebase checks auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Protected Routes: Accessible only to logged-in users */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<DashboardPage />} />
          {/* Add other protected routes here */}
        </Route>

        {/* Public Routes: Accessible only to logged-out users */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Fallback for any other path, redirecting to a safe page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/auth';

import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Correctly import pages using default import syntax
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const { setUser, setIsLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      if (user) {
        // Optional: redirect to dashboard after login
        // navigate('/dashboard');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setIsLoading, navigate]);

  return (
    <Routes>
      {/* Routes for authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add other protected routes here, e.g., /competition/:id */}
        </Route>
      </Route>

      {/* Routes for unauthenticated users */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Fallback route - maybe redirect to login or dashboard */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;

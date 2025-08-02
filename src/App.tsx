import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// This component protects routes that require a user to be logged in.
// It renders the <AppLayout>, which contains an <Outlet> for the child routes.
const ProtectedRouteWrapper = () => {
  const { user } = useAuthStore();
  if (!user) {
    // If no user, redirect to the login page.
    return <Navigate to="/login" replace />;
  }
  // If a user exists, render the main app layout.
  // The nested routes (like Dashboard) will be rendered in the <Outlet>.
  return <AppLayout />;
};

// This component handles routes that are only for logged-out users.
// It renders the <AuthLayout>, which contains an <Outlet> for the child routes.
const PublicRouteWrapper = () => {
    const { user } = useAuthStore();
    if (user) {
        // If a user is logged in, redirect them to the main dashboard.
        return <Navigate to="/" replace />;
    }
    // If no user, render the layout for the authentication pages.
    // The nested routes (like Login) will be rendered in the <Outlet>.
    return <AuthLayout />;
}

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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Routes for logged-out users (e.g., login, signup) */}
      <Route element={<PublicRouteWrapper />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Routes for logged-in users (e.g., dashboard) */}
      <Route element={<ProtectedRouteWrapper />}>
        <Route path="/" element={<DashboardPage />} />
        {/* Add other protected routes here */}
      </Route>

      {/* A fallback route to handle any undefined paths and redirect appropriately */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

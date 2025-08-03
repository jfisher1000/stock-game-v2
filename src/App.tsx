import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

// Layout Components
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Page Components
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";

/**
 * App Component
 *
 * This component handles the application's primary routing logic. It does NOT
 * include a <Router> component, as that is handled in `main.tsx` to ensure
 * it is the single top-level router for the entire application.
 *
 * Key Responsibilities:
 * 1.  Authentication State Management: It uses a `useEffect` hook to listen for
 * changes in the Firebase authentication state.
 *
 * 2.  Loading State Handling: It explicitly handles the initial authentication
 * loading state to prevent race conditions.
 *
 * 3.  Conditional Routing: It renders different sets of routes based on the
 * user's authentication status.
 */
function App() {
  const { setUser, setLoading, user, loading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setLoading]);

  // Display a loading indicator while the auth state is being determined.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-800 dark:text-white">Loading application...</p>
      </div>
    );
  }

  return (
    <Routes>
      {user ? (
        // --- Authenticated Routes ---
        // All authenticated routes are wrapped in the AppLayout,
        // which includes the main navigation and structure.
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Add other protected routes here, e.g., /profile, /settings */}
          {/* Redirect any other path to the dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        // --- Unauthenticated Routes ---
        // All unauthenticated routes are wrapped in the AuthLayout,
        // which provides the centered, focused layout for login/signup.
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          {/* Any other path for a logged-out user redirects to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;

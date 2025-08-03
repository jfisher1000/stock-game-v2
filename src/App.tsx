import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/auth";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

// Layout Components
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ErrorBoundary from "./components/layout/ErrorBoundary";

// Page Components
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";

/**
 * App Component
 *
 * This is the root component of the application. It sets up the main router
 * and handles the application's routing logic.
 *
 * Key Responsibilities:
 * 1.  Authentication State Management: It uses a `useEffect` hook to listen for
 * changes in the Firebase authentication state.
 *
 * 2.  Loading State Handling: It explicitly handles the initial authentication
 * loading state to prevent race conditions with the router.
 *
 * 3.  Conditional Routing: It renders different sets of routes based on the
 * user's authentication status. This is a robust pattern that avoids the
 * complexity of nested protected route components.
 *
 * 4.  Error Handling: The entire application is wrapped in an `ErrorBoundary`
 * component to catch and handle any runtime errors.
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
        {/* You could replace this with a more sophisticated spinner component */}
        <p className="text-white">Loading application...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {user ? (
            // Routes for authenticated users
            <Route
              path="/"
              element={
                <AppLayout>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    {/* Add other protected routes here, e.g., /profile, /settings */}
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </AppLayout>
              }
            />
          ) : (
            // Routes for unauthenticated users
            <Route path="/" element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/forgot-password"
                element={<ForgotPasswordPage />}
              />
              {/* Any other path redirects to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
          )}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

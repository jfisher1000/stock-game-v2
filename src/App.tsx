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
import ProtectedRoute from "./components/auth/ProtectedRoute";
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
 * changes in the Firebase authentication state. When the state changes, it
 * updates the Zustand store (`useAuthStore`) accordingly. This ensures the
 * application's state is always in sync with the user's authentication status.
 *
 * 2.  Routing Configuration: It defines the application's routes using `react-router-dom`.
 * - It uses a nested routing structure to apply different layouts to different
 * parts of the application.
 * - `AuthLayout`: Wraps all authentication-related pages (login, sign-up).
 * Routes nested within it will be centered on the page.
 * - `AppLayout`: Wraps the main application pages that are shown to logged-in users.
 * This layout includes the main navigation and other persistent UI elements.
 * - `ProtectedRoute`: This component wraps routes that should only be accessible
 * to authenticated users, redirecting them to the login page if they are not signed in.
 *
 * 3.  Error Handling: The entire application is wrapped in an `ErrorBoundary`
 * component to catch and handle any runtime errors, preventing the app from crashing.
 */
function App() {
  const { setUser, setLoading, user } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Authentication Routes */}
          {/* These routes use the AuthLayout to center the forms on the page. */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Application Routes */}
          {/* These routes are protected and use the main AppLayout. */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect Logic */}
          {/* Redirect root path to dashboard if logged in, otherwise to login. */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

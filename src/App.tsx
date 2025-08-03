import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/auth';
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage'; 

function App() {
  // Get the state-updating functions from our Zustand store.
  const { setUser, setLoading } = useAuthStore();

  // useEffect with an empty dependency array [] runs only once when the app mounts.
  // This is the perfect place to set up the authentication listener.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // When Firebase determines the auth state, update our global store.
      setUser(user);
      setLoading(false); // We are no longer loading.
    });

    // The cleanup function will run when the component unmounts,
    // preventing memory leaks.
    return () => unsubscribe();
  }, [setUser, setLoading]); // Add dependencies to satisfy the ESLint rule.

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
    </Routes>
  );
}

export default App;

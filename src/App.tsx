import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/auth';

import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes */}
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          {/* Add other protected routes here */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

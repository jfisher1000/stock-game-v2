import { Outlet } from 'react-router-dom';

/**
 * AuthLayout provides a consistent centered layout for authentication pages
 * like Login, Sign Up, and Forgot Password.
 */
const AuthLayout = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* The Outlet component renders the specific child route (e.g., LoginPage) */}
      <Outlet />
    </main>
  );
};

export default AuthLayout;

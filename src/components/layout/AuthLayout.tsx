import { Outlet } from 'react-router-dom';

/**
 * AuthLayout provides a consistent centered layout for authentication pages
 * like Login, Sign Up, and Forgot Password.
 * * - `min-h-screen`: Ensures the layout takes up the full height of the viewport.
 * - `flex`: Enables Flexbox layout for its children.
 * - `items-center`: Aligns children vertically to the center.
 * - `justify-center`: Aligns children horizontally to the center.
 * - `bg-background`: Applies the default background color from your theme.
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

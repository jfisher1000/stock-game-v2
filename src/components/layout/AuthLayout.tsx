import { Outlet } from "react-router-dom";

/**
 * AuthLayout Component
 *
 * This component provides a consistent layout for all authentication-related pages,
 * such as login, sign-up, and password reset. It centers the content both
 * vertically and horizontally on the page, providing a clean and focused user experience.
 *
 * The layout uses Tailwind CSS classes to achieve the centering:
 * - `min-h-screen`: Ensures the layout takes up at least the full height of the viewport.
 * - `flex`: Enables flexbox properties for alignment.
 * - `items-center`: Aligns the content vertically to the center.
 * - `justify-center`: Aligns the content horizontally to the center.
 * - `bg-gray-100 dark:bg-gray-900`: Sets a background color that adapts to the theme.
 *
 * The `<Outlet />` component from `react-router-dom` is used to render the
 * specific child route (e.g., the LoginPage or SignUpPage component).
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { Button } from "../ui/button";

/**
 * Navbar Component
 *
 * This component renders the main navigation bar for the application.
 * It displays different content based on the user's authentication status.
 *
 * The logout functionality is handled by calling the `signOut` method from
 * the `useAuthStore`. The routing logic in `App.tsx` will automatically
 * handle the redirect to the login page when the user state becomes null.
 * This keeps the navigation logic centralized and state-driven.
 */
const Navbar = () => {
  const { user, signOut } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      // No need to navigate here. The router in App.tsx listens to the
      // change in the `user` state and will handle the redirect automatically.
    } catch (error) {
      console.error("Failed to log out:", error);
      // In a real app, you might want to show a toast notification to the user
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Stock Trader
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <Button onClick={handleLogout} variant="ghost" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Logout
              </Button>
            ) : (
              <div className="space-x-4">
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

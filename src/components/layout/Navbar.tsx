import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logOut, isLoading } = useAuthStore();

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors">
          VStock Trader
        </Link>
        <div className="space-x-4">
          {isLoading ? (
            <p className="text-gray-400">Loading...</p>
          ) : user ? (
            <>
              <span className="text-gray-300">Welcome, {user.email}</span>
              <Button onClick={logOut} variant="secondary" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

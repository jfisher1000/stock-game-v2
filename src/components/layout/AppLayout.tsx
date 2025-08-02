import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { useAuthStore } from '@/store/auth';

const AppLayout = () => {
  const { logOut } = useAuthStore();
  const navigate = useNavigate();

  // This function will be called when the user becomes idle
  const handleIdle = () => {
    logOut();
    // Redirect to the login page with a message
    navigate('/login?sessionExpired=true');
  };

  // Set the timeout to 30 minutes (30 * 60 * 1000 = 1800000 milliseconds)
  useIdleTimer(handleIdle, 1800000);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

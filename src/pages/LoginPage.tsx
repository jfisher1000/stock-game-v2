import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');
  const logIn = useAuthStore((state) => state.logIn);
  const { error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for the sessionExpired query parameter on page load
  useEffect(() => {
    if (searchParams.get('sessionExpired')) {
      setSessionExpiredMessage('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate('/');
    } catch (err) {
      console.error("Failed to log in:", err);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Login</h2>
      {sessionExpiredMessage && (
        <p className="text-yellow-400 text-sm text-center mb-4">{sessionExpiredMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
          required
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-indigo-400 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;

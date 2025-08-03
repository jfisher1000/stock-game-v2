import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Local loading state specifically for the login action
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true); // Set loading to true when the process starts

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On successful login, the global onAuthStateChanged listener in App.tsx
      // will detect the new user session and handle routing logic.
      // We can also navigate directly for a faster user experience.
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login failed:", err.code);
      // Provide user-friendly error messages based on the error code
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      // CRITICAL: Always reset the loading state, whether login succeeds or fails.
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground">Log in to continue your trading journey</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoggingIn}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoggingIn}
          />
        </div>
        
        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2">
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

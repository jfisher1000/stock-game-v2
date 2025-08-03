import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in a loading state
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// The onAuthStateChanged listener that was here has been REMOVED.
// It will be moved to App.tsx where it can properly interact with the React lifecycle.

import { create } from "zustand";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true, // Start in a loading state until the initial user check is done
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  signUp: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in App.tsx will handle setting the user
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener in App.tsx will handle setting the user
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  /**
   * Signs the user out of Firebase and clears the local state.
   * This is the authoritative way to log out a user. It immediately sets
   * the user to null in the state for a responsive UI update, which
   * triggers the router in App.tsx to redirect to the login page.
   */
  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut(auth);
      // Explicitly clear the user from the state
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

import { create } from 'zustand';
import { auth, db } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail, // Import the reset function
  User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; // Add reset password function
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user, isLoading: false }),
  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        createdAt: new Date(),
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  logIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  logOut: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  // Add the new resetPassword function
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

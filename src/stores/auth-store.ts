/**
 * Authentication store using Zustand.
 * 
 * Manages user session state across the application.
 * In production, this would integrate with a real auth provider.
 * The store is designed to be easily swappable — the interface
 * remains the same regardless of the auth backend.
 */

import { create } from 'zustand';
import type { User, UserRole } from '@/types';
import { currentUser } from '@/lib/mock-data';

interface AuthState {
  /** Currently authenticated user, or null if not logged in */
  user: User | null;
  /** Whether the auth state has been initialized */
  initialized: boolean;
  /** Whether an auth operation is in progress */
  loading: boolean;
  
  /** Initialize the auth state (check for existing session) */
  initialize: () => void;
  /** Log in with email and password */
  login: (email: string, password: string) => Promise<boolean>;
  /** Log out the current user */
  logout: () => void;
  /** Check if user has a specific role */
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,
  loading: false,

  initialize: () => {
    // In production: check for existing session token, validate it
    // For now: auto-login with mock user for development
    set({ user: currentUser, initialized: true });
  },

  login: async (email: string, _password: string) => {
    set({ loading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production: POST to /api/auth/login
    // For now: accept any credentials and return mock user
    set({ 
      user: { ...currentUser, email },
      loading: false,
    });
    
    return true;
  },

  logout: () => {
    set({ user: null });
    // In production: clear session token, redirect to login
  },

  hasRole: (role: UserRole) => {
    const { user } = get();
    if (!user) return false;
    // Internal role has access to everything
    if (user.role === 'internal') return true;
    return user.role === role;
  },
}));

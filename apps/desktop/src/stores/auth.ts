import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { invoke } from '@tauri-apps/api/core';

interface AuthStore {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (provider: string) => Promise<void>;
  completeLogin: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: true,
      error: null,

      login: async (provider) => {
        set({ isLoading: true, error: null });
        try {
          const result = await invoke<{ success: boolean; data?: any; error?: string }>(
            'authenticate',
            { provider }
          );
          
          if (result.success && result.data) {
            // Open auth URL in browser
            window.open(result.data.token, '_blank');
          } else {
            throw new Error(result.error || 'Authentication failed');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },

      completeLogin: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const result = await invoke<{ success: boolean; data?: any; error?: string }>(
            'authenticate',
            { provider: 'callback', code }
          );
          
          if (result.success && result.data) {
            set({
              isAuthenticated: true,
              user: {
                id: result.data.user_id,
                email: result.data.email,
                name: result.data.name,
                picture: result.data.picture,
              },
              token: result.data.token,
            });
          } else {
            throw new Error(result.error || 'Authentication failed');
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await invoke('logout');
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },

      checkAuth: () => {
        const { token } = get();
        set({
          isAuthenticated: !!token,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// Initialize auth check
useAuthStore.getState().checkAuth();
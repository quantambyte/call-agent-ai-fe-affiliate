import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, setAuthToken, clearAuthToken } from '@/services';
import { ROUTES } from '@/constants';
import type {
  User,
  SigninRequest,
  UpdateProfileRequest,
  AuthStore,
} from '@/types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      signin: async (credentials: SigninRequest) => {
        try {
          set({ isLoading: true });
          const authResponse = await authService.signin(credentials);

          setAuthToken(authResponse.accessToken);
          set({
            user: authResponse.user,
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signout: () => {
        clearAuthToken();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        window.location.href = ROUTES.SIGNIN;
      },

      updateProfile: async (data: UpdateProfileRequest) => {
        try {
          set({ isLoading: true });
          const updatedUser = await authService.updateProfile(data);
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refreshTokens: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const authResponse = await authService.refreshToken(refreshToken);

          setAuthToken(authResponse.accessToken);
          set({
            user: authResponse.user,
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken || null,
            isAuthenticated: true,
          });
        } catch (error) {
          get().signout();
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        setAuthToken(accessToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      clearAuth: () => {
        clearAuthToken();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      _setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

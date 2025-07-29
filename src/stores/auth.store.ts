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
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,

      signin: async (credentials: SigninRequest) => {
        try {
          set({ isLoading: true });
          const authResponse = await authService.signin(credentials);

          if (authResponse.user.userType !== 'AFFILIATE') {
            throw new Error('Access denied. Affiliate access required.');
          }

          setAuthToken(authResponse.accessToken);
          set({
            user: authResponse.user,
            accessToken: authResponse.accessToken,
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

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        setAuthToken(token);
        set({ accessToken: token, isAuthenticated: true });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'affiliate-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.accessToken) {
            setAuthToken(state.accessToken);
          }
          state.setHydrated(true);
        }
      },
    }
  )
);

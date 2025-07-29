import { useAuthStore } from '@/stores/auth.store';
import type { UserType } from '@/types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isHydrated,
    signin,
    signout,
    updateProfile,
  } = useAuthStore();

  const hasRole = (requiredRole: UserType | UserType[]): boolean => {
    if (!user) return false;

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.userType);
    }

    return user.userType === requiredRole;
  };

  const isAffiliate = (): boolean => {
    return user?.isAffiliate || false;
  };

  const canAccessRoute = (allowedRoles: UserType[]): boolean => {
    return hasRole(allowedRoles);
  };

  const getRedirectPath = (): string => {
    if (!user) return '/auth/signin';
    return '/dashboard';
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isHydrated,
    signin,
    signout,
    updateProfile,
    hasRole,
    isAffiliate,
    canAccessRoute,
    getRedirectPath,
  };
};

import type { UserType, UserStatus } from './common';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userType: UserType;
  status: UserStatus;
  organizationId?: string;
  affiliateId?: string;
  defaultAgentId?: string;
  isActive: boolean;
  isPlatformAdmin: boolean;
  isAffiliate: boolean;
  isOrgAdmin: boolean;
  isOrgMember: boolean;
  organizationStatus?: string;
  hasActiveSubscription?: boolean;
  subscriptionStatus?: string;
  canAccessDashboard: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  refreshExpiresIn?: number;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  signin: (credentials: SigninRequest) => Promise<void>;
  signout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshTokens: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  _setHydrated: () => void;
}

import type { UserType, UserStatus } from './common';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
  status: UserStatus;
  affiliateId?: string;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  isActive: boolean;
  isPlatformAdmin: boolean;
  isAffiliate: boolean;
  isOrgAdmin: boolean;
  isOrgMember: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  signin: (credentials: SigninRequest) => Promise<void>;
  signout: () => void;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setHydrated: (hydrated: boolean) => void;
}

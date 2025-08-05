import { api } from './api';
import type {
  AuthResponse,
  SigninRequest,
  UpdateProfileRequest,
  User,
  ApiResponse,
} from '@/types';

export const authService = {
  async signin(data: SigninRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/auth/profile', data);
    return response.data.data;
  },
};

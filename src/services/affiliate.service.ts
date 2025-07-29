import { api } from './api';
import type { Affiliate, UpdateAffiliateRequest, ApiResponse } from '@/types';

export const affiliateService = {
  async getProfile(): Promise<Affiliate> {
    const response = await api.get<ApiResponse<Affiliate>>(
      '/affiliates/profile'
    );
    return response.data.data;
  },

  async updateProfile(data: UpdateAffiliateRequest): Promise<Affiliate> {
    const response = await api.patch<ApiResponse<Affiliate>>(
      '/affiliates/profile',
      data
    );
    return response.data.data;
  },
};

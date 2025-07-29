import { api } from './api';
import type {
  Affiliate,
  Organization,
  Commission,
  UpdateAffiliateRequest,
  ApiResponse,
} from '@/types';

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

  async getOrganizations(): Promise<Organization[]> {
    const response = await api.get<ApiResponse<Organization[]>>(
      '/affiliates/organizations'
    );
    return response.data.data;
  },

  async getCommissions(params?: {
    year?: number;
    status?: string;
    type?: string;
  }): Promise<Commission[]> {
    const searchParams = new URLSearchParams();
    if (params?.year) searchParams.append('year', params.year.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.type) searchParams.append('type', params.type);

    const response = await api.get<ApiResponse<Commission[]>>(
      `/affiliates/commissions?${searchParams.toString()}`
    );
    return response.data.data;
  },

  async getCommissionSummary(year?: number): Promise<{
    totalCommissionsEarned: number;
    totalCommissionsPaid: number;
    totalCommissionsPending: number;
    commissionsByType: Record<string, number>;
    commissionsByStatus: Record<string, number>;
    monthlyBreakdown: Array<{
      month: string;
      totalCommissions: number;
      paidCommissions: number;
      pendingCommissions: number;
    }>;
  }> {
    const searchParams = new URLSearchParams();
    if (year) searchParams.append('year', year.toString());

    const response = await api.get(
      `/affiliates/commission-summary?${searchParams.toString()}`
    );
    return response.data.data;
  },
};

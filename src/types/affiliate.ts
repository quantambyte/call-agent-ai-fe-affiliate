import type {
  AffiliateStatus,
  OrganizationStatus,
  IndustryType,
  CommissionType,
  CommissionStatus,
} from './common';

export interface Affiliate {
  id: string;
  name: string;
  businessName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  defaultCommissionRate: number;
  accountBalance: number;
  status: AffiliateStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    organizations: number;
    commissions: number;
    soldSubscriptions: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  businessName: string;
  industryType: IndustryType;
  status: OrganizationStatus;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  customCommissionRate?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    subscriptions: number;
  };
}

export interface Commission {
  id: string;
  affiliateId: string;
  organizationId: string;
  subscriptionId?: string;
  commissionType: CommissionType;
  commissionRate: number;
  periodStart: string;
  periodEnd: string;
  organizationRevenue: number;
  commissionAmount: number;
  netCommission: number;
  status: CommissionStatus;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    businessName: string;
    industryType: IndustryType;
  };
  subscription?: {
    id: string;
    status: string;
    billingCycle: string;
  };
}

export interface UpdateAffiliateRequest {
  name?: string;
  businessName?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;
}

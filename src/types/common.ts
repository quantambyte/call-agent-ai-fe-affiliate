export type UserType =
  | 'PLATFORM_ADMIN'
  | 'AFFILIATE'
  | 'ORG_ADMIN'
  | 'ORG_MEMBER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type OrganizationStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL';

export type AffiliateStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type IndustryType =
  | 'DENTAL'
  | 'WELLNESS'
  | 'HOSPITALITY'
  | 'BEAUTY'
  | 'FITNESS'
  | 'MEDICAL';

export type CommissionType =
  | 'SETUP_FEE'
  | 'SUBSCRIPTION_SALE'
  | 'MONTHLY_RECURRING';

export type CommissionStatus = 'CALCULATED' | 'APPROVED' | 'PAID' | 'DISPUTED';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

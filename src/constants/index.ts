export const ROUTES = {
  SIGNIN: '/auth/signin',
  DASHBOARD: '/dashboard',
  COMMISSIONS: '/dashboard/commissions',
  ORGANIZATIONS: '/dashboard/organizations',
  AFFILIATE_ACCOUNT: '/dashboard/affiliate-account',
  PROFILE: '/dashboard/profile',
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const INDUSTRY_TYPES = [
  { value: 'DENTAL', label: 'Dental' },
  { value: 'WELLNESS', label: 'Wellness' },
  { value: 'HOSPITALITY', label: 'Hospitality' },
  { value: 'BEAUTY', label: 'Beauty' },
  { value: 'FITNESS', label: 'Fitness' },
  { value: 'MEDICAL', label: 'Medical' },
];

export const COMMISSION_STATUS_OPTIONS = [
  { value: 'CALCULATED', label: 'Calculated' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PAID', label: 'Paid' },
  { value: 'DISPUTED', label: 'Disputed' },
];

export const COMMISSION_TYPE_OPTIONS = [
  { value: 'SETUP_FEE', label: 'Setup Fee' },
  { value: 'SUBSCRIPTION_SALE', label: 'Subscription Sale' },
  { value: 'MONTHLY_RECURRING', label: 'Monthly Recurring' },
];

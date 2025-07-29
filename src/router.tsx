import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { Signin } from '@/modules/auth';
import { Dashboard, DashboardLayout } from '@/modules/dashboard';
import { CommissionsPage } from '@/modules/dashboard/commissions/commissions-page';
import { OrganizationsPage } from '@/modules/dashboard/organizations/organizations-page';
import { AffiliateAccountPage } from '@/modules/dashboard/affiliate-account/affiliate-account-page';
import { ProfilePage } from '@/modules/dashboard/profile/profile-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/auth',
    children: [
      {
        path: 'signin',
        element: <Signin />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'commissions',
        element: <CommissionsPage />,
      },
      {
        path: 'organizations',
        element: <OrganizationsPage />,
      },
      {
        path: 'affiliate-account',
        element: <AffiliateAccountPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

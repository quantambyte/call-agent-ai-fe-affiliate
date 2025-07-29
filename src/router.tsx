import { createBrowserRouter } from 'react-router';
import App from './App';
import { Signup, Signin } from '@/modules/auth';
import { Dashboard, DashboardLayout } from '@/modules/dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/auth',
    children: [
      {
        path: 'signup',
        element: <Signup />,
      },
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
    ],
  },
]);

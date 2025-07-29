import { Outlet } from 'react-router';
import { ProtectedRoute } from '@/components/guards/protected-route';
import { SidebarNav } from '@/components/navigation/sidebar-nav';

export const DashboardLayout = () => {
  return (
    <ProtectedRoute allowedRoles={['AFFILIATE']}>
      <div className="flex h-screen bg-background">
        <SidebarNav />
        <div className="flex-1 lg:ml-64">
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

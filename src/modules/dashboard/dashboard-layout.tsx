import { Outlet } from 'react-router';
import Sidebar from './components/sidebar';

const DashboardLayout = () => {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default DashboardLayout;

import { Navigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

function App() {
  const { isAuthenticated, user, getRedirectPath, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return <Navigate to="/auth/signin" replace />;
}

export default App;

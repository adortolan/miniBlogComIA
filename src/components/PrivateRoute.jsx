import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
          <p className="mt-4 text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;

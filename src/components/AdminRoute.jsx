import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';
import { db } from '../config/firebase';

const AdminRoute = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user?.uid) {
        setCheckingRole(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erro ao verificar role do usuário:', error);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user?.uid, authLoading]);

  if (authLoading || checkingRole) {
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

  if (!isAdmin) {
    return (
      <Navigate 
        to="/" 
        state={{ message: 'Acesso negado. Você não tem permissão para acessar esta área.' }} 
        replace 
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;

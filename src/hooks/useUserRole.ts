import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

type UserRole = 'admin' | 'reader' | 'writer';

/**
 * Hook para buscar role do usuário do Firestore
 * @param {string | null} userId - ID do usuário
 * @returns {Object} - Estado com role, loading e error
 */
export const useUserRole = (userId: string | null) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      setLoading(true);
      setError(null);

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = (userData?.role as UserRole) || 'reader';
          setRole(userRole);
        } else {
          setRole('reader');
        }
      } catch (err) {
        console.error('Erro ao buscar role do usuário:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar role do usuário';
        setError(errorMessage);
        setRole('reader');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [userId]);

  return {
    role,
    loading,
    error,
    isAdmin: role === 'admin',
  };
};

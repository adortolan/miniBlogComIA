import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Hook para buscar role do usuário do Firestore
 * @param {string} userId - ID do usuário
 * @returns {Object} - Estado com role, loading e error
 */
export const useUserRole = (userId) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setRole(userDoc.data()?.role || 'reader');
        } else {
          setRole('reader');
        }
      } catch (err) {
        console.error('Erro ao buscar role do usuário:', err);
        setError(err.message);
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

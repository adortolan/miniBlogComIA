import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
      return { success: true };
    } catch (err) {
      const errorMessage = 'Erro ao fazer logout';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
    error
  };
};

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

interface LogoutResult {
  success: boolean;
  error?: string;
}

export const useLogout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async (): Promise<LogoutResult> => {
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

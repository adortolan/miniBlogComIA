import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      let errorMessage = 'Erro ao fazer login';

      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Usuário desabilitado';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
          break;
        default:
          errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (err) {
      let errorMessage = 'Erro ao fazer login com Google';

      switch (err.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqueado. Permita popups para este site';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Login cancelado';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Login cancelado';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Conta já existe com credencial diferente';
          break;
        default:
          errorMessage = err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loginWithEmailAndPassword,
    loginWithGoogle,
    loading,
    error
  };
};

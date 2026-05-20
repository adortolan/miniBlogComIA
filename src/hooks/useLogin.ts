import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  AuthError 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface GoogleUserData {
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loginWithEmailAndPassword = async (email: string, password: string): Promise<LoginResult> => {
    if (!email || !password) {
      const validationError = new Error('Email e senha são obrigatórios');
      setError(validationError.message);
      return { success: false, error: validationError.message };
    }

    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const authErr = err as AuthError;
      let errorMessage = 'Erro ao fazer login';

      switch (authErr.code) {
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
          errorMessage = authErr.message || errorMessage;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<LoginResult> => {
    setLoading(true);
    setError(null);

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (!user.uid || !user.email) {
        throw new Error('Dados do usuário incompletos');
      }
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const userData: GoogleUserData = {
          displayName: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          role: 'reader'
        };
        
        await setDoc(userDocRef, userData);
      }
      
      return { success: true };
    } catch (err) {
      const authErr = err as AuthError;
      let errorMessage = 'Erro ao fazer login com Google';

      switch (authErr.code) {
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
          errorMessage = authErr.message || errorMessage;
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

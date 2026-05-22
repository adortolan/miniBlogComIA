import { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  AuthError 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { logger } from '../utils/logger';
import { validatePassword } from '../utils/passwordValidation';

interface RegisterResult {
  success: boolean;
  error?: string;
}

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  role: string;
  createdAt: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (displayName: string, email: string, password: string): Promise<RegisterResult> => {
    if (!displayName || !email || !password) {
      const validationError = new Error('Nome, email e senha são obrigatórios');
      setError(validationError.message);
      return { success: false, error: validationError.message };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const validationError = new Error(passwordValidation.errors[0]);
      setError(validationError.message);
      return { success: false, error: validationError.message };
    }

    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await updateProfile(user, {
          displayName
        });

        const userProfile: UserProfile = {
          displayName,
          email,
          photoURL: '',
          role: 'reader',
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), userProfile, { merge: false });

        return { success: true };
      } catch (profileError) {
        logger.error('Erro ao criar perfil:', profileError);
        try {
          await user.delete();
        } catch (deleteError) {
          logger.error('Erro ao deletar usuário:', deleteError);
        }
        throw profileError;
      }
    } catch (err) {
      const authErr = err as AuthError;
      let errorMessage = 'Erro ao criar conta';

      switch (authErr.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email já está em uso';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca. Use no mínimo 6 caracteres';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Operação não permitida';
          break;
        case 'permission-denied':
          errorMessage = 'Erro de permissão no Firestore. Verifique as regras de segurança';
          break;
        case 'unavailable':
          errorMessage = 'Serviço indisponível. Verifique sua conexão e as configurações do Firebase';
          break;
        default:
          if (authErr.message && authErr.message.includes('CORS')) {
            errorMessage = 'Erro de CORS. Verifique as variáveis de ambiente do Firebase';
          } else {
            errorMessage = authErr?.message || errorMessage;
          }
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error
  };
};

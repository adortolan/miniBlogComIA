import { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (displayName, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await updateProfile(user, {
          displayName
        });

        await setDoc(doc(db, 'users', user.uid), {
          displayName,
          email,
          photoURL: '',
          role: 'reader',
          createdAt: new Date().toISOString()
        }, { merge: false });

        return { success: true };
      } catch (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        try {
          await user.delete();
        } catch (deleteError) {
          console.error('Erro ao deletar usuário:', deleteError);
        }
        throw profileError;
      }
    } catch (err) {
      let errorMessage = 'Erro ao criar conta';

      switch (err.code) {
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
          if (err.message && err.message.includes('CORS')) {
            errorMessage = 'Erro de CORS. Verifique as variáveis de ambiente do Firebase';
          } else {
            errorMessage = err?.message || errorMessage;
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

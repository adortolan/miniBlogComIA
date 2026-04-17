import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogin } from './useLogin';

const mockSignInWithEmailAndPassword = vi.fn();
const mockSignInWithPopup = vi.fn();
const mockGoogleAuthProvider = vi.fn();

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args),
  signInWithPopup: (...args) => mockSignInWithPopup(...args),
  GoogleAuthProvider: class {
    constructor() {
      mockGoogleAuthProvider();
    }
  },
}));

vi.mock('../config/firebase', () => ({
  auth: {},
}));

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginWithEmailAndPassword', () => {
    it('deve fazer login com sucesso', async () => {
      mockSignInWithEmailAndPassword.mockResolvedValue({ user: { email: 'test@example.com' } });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.loginWithEmailAndPassword('test@example.com', 'password123');
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('deve retornar erro para usuário não encontrado', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/user-not-found' });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.loginWithEmailAndPassword('wrong@example.com', 'password');
      });

      expect(loginResult.success).toBe(false);
      expect(result.current.error).toBe('Usuário não encontrado');
    });

    it('deve retornar erro para senha incorreta', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.loginWithEmailAndPassword('test@example.com', 'wrongpassword');
      });

      expect(loginResult.success).toBe(false);
      expect(result.current.error).toBe('Senha incorreta');
    });

    it('deve retornar erro para email inválido', async () => {
      mockSignInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-email' });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.loginWithEmailAndPassword('invalid-email', 'password');
      });

      expect(loginResult.success).toBe(false);
      expect(result.current.error).toBe('Email inválido');
    });
  });

  describe('loginWithGoogle', () => {
    it('deve fazer login com Google com sucesso', async () => {
      mockSignInWithPopup.mockResolvedValue({ user: { email: 'google@example.com' } });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.loginWithGoogle();
      });

      expect(loginResult.success).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('deve retornar erro quando popup é bloqueado', async () => {
      mockSignInWithPopup.mockRejectedValue({ code: 'auth/popup-blocked' });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.loginWithGoogle();
      });

      expect(loginResult.success).toBe(false);
      expect(result.current.error).toBe('Popup bloqueado. Permita popups para este site');
    });

    it('deve retornar erro quando usuário cancela o popup', async () => {
      mockSignInWithPopup.mockRejectedValue({ code: 'auth/popup-closed-by-user' });

      const { result } = renderHook(() => useLogin());

      let loginResult;
      await act(async () => {
        loginResult = await result.current.loginWithGoogle();
      });

      expect(loginResult.success).toBe(false);
      expect(result.current.error).toBe('Login cancelado');
    });
  });

  it('deve gerenciar estado de loading corretamente', async () => {
    mockSignInWithEmailAndPassword.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ user: {} }), 100))
    );

    const { result } = renderHook(() => useLogin());

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.loginWithEmailAndPassword('test@example.com', 'password');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});

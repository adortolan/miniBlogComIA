import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegister } from './useRegister';

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('../config/firebase', () => ({
  auth: {},
  db: {},
}));

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('deve inicializar com estados corretos', () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.register).toBe('function');
  });

  it('deve registrar usuário com sucesso', async () => {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { setDoc } = await import('firebase/firestore');

    const mockUser = { uid: 'test-uid', email: 'test@test.com' };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: mockUser });
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockResolvedValue();

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'password123'
      );
    });

    expect(registerResult.success).toBe(true);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@test.com',
      'password123'
    );
    expect(updateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: 'Test User'
    });
    expect(setDoc).toHaveBeenCalled();
  });

  it('deve criar documento do usuário no Firestore com role reader', async () => {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { setDoc, doc } = await import('firebase/firestore');

    const mockUser = { uid: 'test-uid', email: 'test@test.com' };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: mockUser });
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockResolvedValue();
    vi.mocked(doc).mockReturnValue({ id: 'test-uid' });

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.register('Test User', 'test@test.com', 'password123');
    });

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          displayName: 'Test User',
          email: 'test@test.com',
          photoURL: '',
          role: 'reader',
          createdAt: expect.any(String)
        }),
        { merge: false }
      );
    });
  });

  it('deve tratar erro de email já em uso', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    const error = { code: 'auth/email-already-in-use', message: 'Email já em uso' };
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'password123'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(result.current.error).toBe('Email já está em uso');
  });

  it('deve tratar erro de senha fraca', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    const error = { code: 'auth/weak-password', message: 'Senha fraca' };
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'weak'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(result.current.error).toBe('Senha muito fraca. Use no mínimo 6 caracteres');
  });

  it('deve tratar erro de email inválido', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    const error = { code: 'auth/invalid-email', message: 'Email inválido' };
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'invalid-email',
        'password123'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(result.current.error).toBe('Email inválido');
  });

  it('deve gerenciar estado de loading corretamente', async () => {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { setDoc } = await import('firebase/firestore');

    const mockUser = { uid: 'test-uid', email: 'test@test.com' };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: mockUser });
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockResolvedValue();

    const { result } = renderHook(() => useRegister());

    expect(result.current.loading).toBe(false);

    const registerPromise = act(async () => {
      await result.current.register('Test User', 'test@test.com', 'password123');
    });

    await registerPromise;
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('deve tratar erro de permissão do Firestore', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    const error = { code: 'permission-denied', message: 'Permission denied' };
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'password123'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(result.current.error).toBe('Erro de permissão no Firestore. Verifique as regras de segurança');
  });

  it('deve tratar erro de serviço indisponível', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    const error = { code: 'unavailable', message: 'Service unavailable' };
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'password123'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(result.current.error).toBe('Serviço indisponível. Verifique sua conexão e as configurações do Firebase');
  });

  it('deve tratar erro de CORS', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    const error = { code: 'unknown', message: 'CORS error occurred' };
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error);

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'password123'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(result.current.error).toBe('Erro de CORS. Verifique as variáveis de ambiente do Firebase');
  });

  it('deve deletar usuário quando há erro ao criar perfil no Firestore', async () => {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { setDoc } = await import('firebase/firestore');

    const mockUser = { 
      uid: 'test-uid', 
      email: 'test@test.com',
      delete: vi.fn().mockResolvedValue()
    };
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: mockUser });
    vi.mocked(updateProfile).mockResolvedValue();
    vi.mocked(setDoc).mockRejectedValue(new Error('Firestore error'));

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'password123'
      );
    });

    expect(registerResult.success).toBe(false);
    expect(mockUser.delete).toHaveBeenCalled();
  });
});

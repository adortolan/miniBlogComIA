import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegister } from './useRegister';

const mockCreateUserWithEmailAndPassword = vi.fn();
const mockUpdateProfile = vi.fn();
const mockSetDoc = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUserWithEmailAndPassword(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}));

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
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
    const mockUser = { uid: 'test-uid', email: 'test@test.com' };
    mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    mockUpdateProfile.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        'password123'
      );
    });

    expect(registerResult!.success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled();
    expect(mockUpdateProfile).toHaveBeenCalled();
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('deve retornar erro para email já em uso', async () => {
    mockCreateUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'existing@test.com',
        'password123'
      );
    });

    expect(registerResult!.success).toBe(false);
    expect(registerResult!.error).toBe('Email já está em uso');
    expect(result.current.error).toBe('Email já está em uso');
  });

  it('deve retornar erro para senha fraca', async () => {
    mockCreateUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/weak-password' });

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'test@test.com',
        '123'
      );
    });

    expect(registerResult!.success).toBe(false);
    expect(registerResult!.error).toBe('Senha muito fraca. Use no mínimo 6 caracteres');
  });

  it('deve retornar erro para email inválido', async () => {
    mockCreateUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-email' });

    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(
        'Test User',
        'invalid-email',
        'password123'
      );
    });

    expect(registerResult!.success).toBe(false);
    expect(registerResult!.error).toBe('Email inválido');
  });

  it('deve validar campos obrigatórios', async () => {
    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register('', 'test@test.com', 'password123');
    });

    expect(registerResult!.success).toBe(false);
    expect(registerResult!.error).toBe('Nome, email e senha são obrigatórios');
  });

  it('deve validar comprimento mínimo da senha', async () => {
    const { result } = renderHook(() => useRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register('Test User', 'test@test.com', '123');
    });

    expect(registerResult!.success).toBe(false);
    expect(registerResult!.error).toBe('Senha muito fraca. Use no mínimo 6 caracteres');
  });

  it('deve deletar usuário quando falha criação do perfil', async () => {
    const mockUser = { 
      uid: 'test-uid', 
      email: 'test@test.com',
      delete: vi.fn().mockResolvedValue(undefined)
    };
    
    mockCreateUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    mockUpdateProfile.mockRejectedValue(new Error('Profile update failed'));

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      try {
        await result.current.register('Test User', 'test@test.com', 'password123');
      } catch {
        // Erro esperado
      }
    });

    expect(mockUser.delete).toHaveBeenCalled();
  });

  it('deve definir loading como true durante registro', async () => {
    mockCreateUserWithEmailAndPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ user: { uid: 'test' } }), 100))
    );
    mockUpdateProfile.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.register('Test User', 'test@test.com', 'password123');
    });

    expect(result.current.loading).toBe(true);
  });

  it('deve resetar estado de erro ao chamar novamente', async () => {
    mockCreateUserWithEmailAndPassword
      .mockRejectedValueOnce({ code: 'auth/email-already-in-use' })
      .mockResolvedValueOnce({ user: { uid: 'test-uid', email: 'test@test.com' } });
    mockUpdateProfile.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      try {
        await result.current.register('Test User', 'existing@test.com', 'password123');
      } catch {
        // Primeiro erro esperado
      }
    });

    expect(result.current.error).toBeTruthy();

    await act(async () => {
      await result.current.register('Test User', 'new@test.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});

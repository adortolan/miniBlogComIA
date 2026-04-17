import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLogout } from './useLogout';

const mockSignOut = vi.fn();

vi.mock('firebase/auth', () => ({
  signOut: (...args) => mockSignOut(...args),
}));

vi.mock('../config/firebase', () => ({
  auth: {},
}));

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve fazer logout com sucesso', async () => {
    mockSignOut.mockResolvedValue();

    const { result } = renderHook(() => useLogout());

    let logoutResult;
    await act(async () => {
      logoutResult = await result.current.logout();
    });

    expect(logoutResult.success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('deve retornar erro quando logout falha', async () => {
    mockSignOut.mockRejectedValue(new Error('Logout failed'));

    const { result } = renderHook(() => useLogout());

    let logoutResult;
    await act(async () => {
      logoutResult = await result.current.logout();
    });

    expect(logoutResult.success).toBe(false);
    expect(logoutResult.error).toBe('Erro ao fazer logout');
    expect(result.current.error).toBe('Erro ao fazer logout');
  });

  it('deve gerenciar estado de loading corretamente', async () => {
    mockSignOut.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useLogout());

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.logout();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.loading).toBe(false);
  });

  it('deve limpar erro antes de nova tentativa de logout', async () => {
    mockSignOut.mockRejectedValueOnce(new Error('First error'));
    mockSignOut.mockResolvedValueOnce();

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.error).toBe('Erro ao fazer logout');

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.error).toBe(null);
  });
});

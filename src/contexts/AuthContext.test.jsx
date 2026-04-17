import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuthContext } from './AuthContext';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null);
    return vi.fn();
  }),
}));

vi.mock('../config/firebase', () => ({
  auth: {},
}));

const TestComponent = () => {
  const { user, loading, isAuthenticated } = useAuthContext();
  
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { onAuthStateChanged } = await import('firebase/auth');
    vi.mocked(onAuthStateChanged).mockImplementation((auth, callback) => {
      callback(null);
      return vi.fn();
    });
  });

  it('deve fornecer valores iniciais corretos', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('deve lançar erro quando useAuthContext é usado fora do Provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuthContext must be used within an AuthProvider');
    
    consoleError.mockRestore();
  });

  it('deve inicializar com loading true', async () => {
    const { onAuthStateChanged } = await import('firebase/auth');
    vi.mocked(onAuthStateChanged).mockImplementationOnce((auth, callback) => {
      return vi.fn();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading').textContent).toBe('true');
  });
});

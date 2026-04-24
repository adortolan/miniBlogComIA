import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthStatus from './AuthStatus';

const mockUseAuthContext = vi.fn();

vi.mock('../hooks/useAuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AuthStatus', () => {
  it('deve exibir loading quando carregando', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      loading: true,
      isAuthenticated: false,
    });

    renderWithRouter(<AuthStatus />);

    expect(screen.getByText(/verificando autenticação/i)).toBeInTheDocument();
  });

  it('deve exibir status não autenticado quando usuário não está logado', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    renderWithRouter(<AuthStatus />);

    expect(screen.getByText(/nenhum usuário autenticado/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fazer login/i })).toBeInTheDocument();
  });

  it('deve exibir informações do usuário quando autenticado', () => {
    const mockUser = {
      email: 'test@example.com',
      uid: '12345',
    };

    mockUseAuthContext.mockReturnValue({
      user: mockUser,
      loading: false,
      isAuthenticated: true,
    });

    renderWithRouter(<AuthStatus />);

    expect(screen.getByText(/usuário autenticado/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/12345/i)).toBeInTheDocument();
  });

  it('deve ter link para login quando não autenticado', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    renderWithRouter(<AuthStatus />);

    const loginLink = screen.getByRole('link', { name: /fazer login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('deve aplicar classes CSS corretas baseadas no estado de autenticação', () => {
    mockUseAuthContext.mockReturnValue({
      user: { email: 'test@example.com', uid: '123' },
      loading: false,
      isAuthenticated: true,
    });

    const { container } = renderWithRouter(<AuthStatus />);

    const statusDiv = container.querySelector('.bg-green-100');
    expect(statusDiv).toBeInTheDocument();
  });

  it('deve aplicar classes CSS corretas quando não autenticado', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      loading: false,
      isAuthenticated: false,
    });

    const { container } = renderWithRouter(<AuthStatus />);

    const statusDiv = container.querySelector('.bg-gray-100');
    expect(statusDiv).toBeInTheDocument();
  });
});

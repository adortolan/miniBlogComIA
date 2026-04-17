import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

const mockUseAuthContext = vi.fn();
const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

vi.mock('../hooks/useLogout', () => ({
  useLogout: () => ({
    logout: mockLogout,
    loading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar logo e links básicos', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderWithRouter(<Navbar />);

    expect(screen.getByText('MiniBlog')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('deve mostrar links de login e registro quando não autenticado', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderWithRouter(<Navbar />);

    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });

  it('não deve mostrar botão de sair quando não autenticado', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderWithRouter(<Navbar />);

    expect(screen.queryByText('Sair')).not.toBeInTheDocument();
  });

  it('deve mostrar links autenticados quando usuário está logado', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', displayName: 'Test User' },
    });

    renderWithRouter(<Navbar />);

    expect(screen.getByText('Criar Post')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve exibir nome do usuário quando autenticado', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', displayName: 'Test User' },
    });

    renderWithRouter(<Navbar />);

    expect(screen.getByText(/olá, test user/i)).toBeInTheDocument();
  });

  it('deve exibir parte do email quando displayName não existe', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com', displayName: null },
    });

    renderWithRouter(<Navbar />);

    expect(screen.getByText(/olá, test/i)).toBeInTheDocument();
  });

  it('deve chamar logout e navegar ao clicar em Sair', async () => {
    mockLogout.mockResolvedValue({ success: true });
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com' },
    });

    renderWithRouter(<Navbar />);

    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);

    await vi.waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  it('não deve mostrar links de login quando autenticado', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com' },
    });

    renderWithRouter(<Navbar />);

    expect(screen.queryByText('Entrar')).not.toBeInTheDocument();
    expect(screen.queryByText('Criar Conta')).not.toBeInTheDocument();
  });

  it('links devem ter os hrefs corretos', () => {
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    renderWithRouter(<Navbar />);

    const homeLink = screen.getAllByText('Home')[0];
    const loginLink = screen.getByText('Entrar');
    const registerLink = screen.getByText('Criar Conta');

    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
    expect(registerLink.closest('a')).toHaveAttribute('href', '/registro');
  });
});

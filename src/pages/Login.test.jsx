import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

const mockUseAuthContext = vi.fn();
const mockLoginWithEmailAndPassword = vi.fn();
const mockLoginWithGoogle = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../hooks/useAuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}));

const mockUseLogin = vi.fn();

vi.mock('../hooks/useLogin', () => ({
  useLogin: () => mockUseLogin(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
    });
    mockUseLogin.mockReturnValue({
      loginWithEmailAndPassword: mockLoginWithEmailAndPassword,
      loginWithGoogle: mockLoginWithGoogle,
      loading: false,
      error: null,
    });
  });

  it('deve renderizar formulário de login', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText(/entrar no miniblog/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^entrar$/i })).toBeInTheDocument();
  });

  it('deve ter botão de login com Google', () => {
    renderWithRouter(<Login />);

    expect(screen.getByText(/entrar com google/i)).toBeInTheDocument();
  });

  it('deve ter link para página de registro', () => {
    renderWithRouter(<Login />);

    const registerLink = screen.getByText(/criar conta/i);
    expect(registerLink.closest('a')).toHaveAttribute('href', '/registro');
  });

  it('deve validar email vazio', async () => {
    renderWithRouter(<Login />);

    const submitButton = screen.getByRole('button', { name: /^entrar$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    });

    expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('deve validar formato de email', async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });

    expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('deve validar senha vazia', async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });

    expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo da senha', async () => {
    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument();
    });

    expect(mockLoginWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('deve chamar loginWithEmailAndPassword com dados corretos', async () => {
    mockLoginWithEmailAndPassword.mockResolvedValue({ success: true });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('deve chamar loginWithGoogle ao clicar no botão Google', async () => {
    mockLoginWithGoogle.mockResolvedValue({ success: true });

    renderWithRouter(<Login />);

    const googleButton = screen.getByText(/entrar com google/i);
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalled();
    });
  });

  it('deve navegar para home após login bem-sucedido', async () => {
    mockLoginWithEmailAndPassword.mockResolvedValue({ success: true });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('não deve navegar se login falhar', async () => {
    mockLoginWithEmailAndPassword.mockResolvedValue({ success: false });

    renderWithRouter(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /^entrar$/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginWithEmailAndPassword).toHaveBeenCalled();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

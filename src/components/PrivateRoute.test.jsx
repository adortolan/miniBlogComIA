import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockAuthContext = {
  isAuthenticated: false,
  loading: false,
};

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

const TestComponent = () => <div>Protected Content</div>;

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPrivateRoute = (authState = {}) => {
    Object.assign(mockAuthContext, authState);

    return render(
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  it('deve exibir loading quando estiver carregando', () => {
    renderPrivateRoute({ loading: true, isAuthenticated: false });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve renderizar conteúdo protegido quando autenticado', () => {
    renderPrivateRoute({ loading: false, isAuthenticated: true });

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('deve redirecionar para /login quando não autenticado', () => {
    renderPrivateRoute({ loading: false, isAuthenticated: false });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('não deve exibir loading quando não estiver carregando', () => {
    renderPrivateRoute({ loading: false, isAuthenticated: true });

    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
  });
});

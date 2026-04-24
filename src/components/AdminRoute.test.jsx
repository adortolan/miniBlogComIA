import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import AdminRoute from './AdminRoute';

let mockAuthContext = {
  isAuthenticated: false,
  loading: false,
  user: null,
};

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

const mockGetDoc = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase/firestore', () => ({
  doc: (...args) => mockDoc(...args),
  getDoc: (...args) => mockGetDoc(...args),
}));

vi.mock('../config/firebase', () => ({
  db: {},
  auth: {},
}));

const TestComponent = () => <div>Admin Content</div>;

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAdminRoute = (authState = {}, userRole = 'reader') => {
    mockAuthContext = { ...mockAuthContext, ...authState };

    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ role: userRole }),
    });

    mockDoc.mockReturnValue({ id: 'test-uid' });

    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve exibir loading quando estiver verificando autenticação', () => {
    renderAdminRoute({ loading: true, isAuthenticated: false, user: null });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve redirecionar para /login quando não autenticado', () => {
    renderAdminRoute({ loading: false, isAuthenticated: false, user: null });

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).toBeInTheDocument();
  });

  it('deve exibir loading enquanto verifica role do usuário', () => {
    renderAdminRoute({ 
      loading: false, 
      isAuthenticated: true, 
      user: { uid: 'test-uid' } 
    });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve renderizar conteúdo admin quando usuário é admin', async () => {
    renderAdminRoute(
      { 
        loading: false, 
        isAuthenticated: true, 
        user: { uid: 'test-uid' } 
      },
      'admin'
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  it('deve redirecionar para home quando usuário não é admin', async () => {
    renderAdminRoute(
      { 
        loading: false, 
        isAuthenticated: true, 
        user: { uid: 'test-uid' } 
      },
      'reader'
    );

    await waitFor(() => {
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  it('deve buscar role do usuário no Firestore', async () => {
    renderAdminRoute(
      { 
        loading: false, 
        isAuthenticated: true, 
        user: { uid: 'test-uid' } 
      },
      'admin'
    );

    await waitFor(() => {
      expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'users', 'test-uid');
      expect(mockGetDoc).toHaveBeenCalled();
    });
  });
});

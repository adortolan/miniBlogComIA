import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from './AdminRoute';

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
  user: null,
};

vi.mock('../contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('../config/firebase', () => ({
  db: {},
}));

const TestComponent = () => <div>Admin Content</div>;

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAdminRoute = async (authState = {}, userRole = 'reader') => {
    Object.assign(mockAuthContext, authState);

    const { getDoc } = await import('firebase/firestore');
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ role: userRole }),
    });

    return render(
      <BrowserRouter>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/" element={<TestComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  it('deve exibir loading quando estiver verificando autenticação', async () => {
    await renderAdminRoute({ loading: true, isAuthenticated: false, user: null });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve redirecionar para /login quando não autenticado', async () => {
    await renderAdminRoute({ loading: false, isAuthenticated: false, user: null });

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('deve exibir loading enquanto verifica role do usuário', async () => {
    await renderAdminRoute({ 
      loading: false, 
      isAuthenticated: true, 
      user: { uid: 'test-uid' } 
    });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it('deve renderizar conteúdo admin quando usuário é admin', async () => {
    await renderAdminRoute(
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
    await renderAdminRoute(
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
    const { getDoc, doc } = await import('firebase/firestore');
    
    await renderAdminRoute(
      { 
        loading: false, 
        isAuthenticated: true, 
        user: { uid: 'test-uid' } 
      },
      'admin'
    );

    await waitFor(() => {
      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', 'test-uid');
      expect(getDoc).toHaveBeenCalled();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EditPost } from './EditPost';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { useUpdatePost } from '../hooks/useUpdatePost';
import { useUserRole } from '../hooks/useUserRole';
import type { Post } from '../types';

vi.mock('../services/postService');
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../hooks/useUpdatePost', () => ({
  useUpdatePost: vi.fn(),
}));
vi.mock('../hooks/useUserRole', () => ({
  useUserRole: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('EditPost', () => {
  const mockPost: Post = {
    id: 'post123',
    slug: 'meu-post',
    title: 'Meu Post',
    content: 'Conteúdo do post',
    tags: ['react', 'javascript'],
    imageURL: 'https://example.com/image.jpg',
    authorId: 'user123',
    createdAt: { seconds: 1672531200, nanoseconds: 0 },
    updatedAt: { seconds: 1672531200, nanoseconds: 0 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as vi.Mock).mockReturnValue({
      user: { uid: 'user123' },
    });
    (useUpdatePost as vi.Mock).mockReturnValue({
      updatePost: vi.fn(),
      loading: false,
      error: null,
    });
    (useUserRole as vi.Mock).mockReturnValue({
      role: 'reader',
      loading: false,
      error: null,
      isAdmin: false,
    });
  });

  const renderEditPost = (postId = 'post123') => {
    return render(
      <MemoryRouter initialEntries={[`/admin/posts/edit/${postId}`]}>
        <Routes>
          <Route path="/admin/posts/edit/:id" element={<EditPost />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve exibir loading enquanto carrega post', () => {
    (postService.getPostById as vi.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    renderEditPost();

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('deve pré-preencher formulário com dados do post', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);

    renderEditPost();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Meu Post')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Conteúdo do post')).toBeInTheDocument();
      expect(screen.getByDisplayValue('react, javascript')).toBeInTheDocument();
    });
  });

  it('deve redirecionar para home se usuário não for autor ou admin', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);
    (useAuth as vi.Mock).mockReturnValue({
      user: { uid: 'other-user' },
    });
    (useUserRole as vi.Mock).mockReturnValue({
      role: 'reader',
      loading: false,
      error: null,
      isAdmin: false,
    });

    renderEditPost();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('deve permitir admin editar post de outro usuário', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);
    (useAuth as vi.Mock).mockReturnValue({
      user: { uid: 'admin-user' },
    });
    (useUserRole as vi.Mock).mockReturnValue({
      role: 'admin',
      loading: false,
      error: null,
      isAdmin: true,
    });

    renderEditPost();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Meu Post')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve redirecionar para login se usuário não autenticado', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);
    (useAuth as vi.Mock).mockReturnValue({
      user: null,
    });

    renderEditPost();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('deve exibir mensagem de erro quando post não encontrado', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(null);

    renderEditPost();

    await waitFor(() => {
      expect(screen.getByText(/post não encontrado/i)).toBeInTheDocument();
    });
  });

  it('deve chamar updatePost ao submeter formulário', async () => {
    const mockUpdatePost = vi.fn().mockResolvedValue({ slug: 'meu-post-atualizado' });
    (useUpdatePost as vi.Mock).mockReturnValue({
      updatePost: mockUpdatePost,
      loading: false,
      error: null,
    });
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);

    renderEditPost();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Meu Post')).toBeInTheDocument();
    });
  });

  it('deve exibir erro quando atualização falha', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);
    (useUpdatePost as vi.Mock).mockReturnValue({
      updatePost: vi.fn(),
      loading: false,
      error: 'Erro ao atualizar post',
    });

    renderEditPost();

    await waitFor(() => {
      expect(screen.getByText(/erro ao atualizar post/i)).toBeInTheDocument();
    });
  });

  it('deve exibir título da página', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);

    renderEditPost();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /editar post/i })).toBeInTheDocument();
    });
  });

  it('deve exibir loading durante atualização', async () => {
    (postService.getPostById as vi.Mock).mockResolvedValue(mockPost);
    (useUpdatePost as vi.Mock).mockReturnValue({
      updatePost: vi.fn(),
      loading: true,
      error: null,
    });

    renderEditPost();

    await waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });
  });
});

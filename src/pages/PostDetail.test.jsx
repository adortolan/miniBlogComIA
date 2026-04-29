import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { PostDetail } from './PostDetail';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../services/postService');
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PostDetail', () => {
  const mockPost = {
    id: 'post123',
    slug: 'meu-post',
    title: 'Meu Post de Teste',
    content: '# Título\n\nEste é um **post** de exemplo com *Markdown*.',
    tags: ['react', 'javascript'],
    imageURL: 'https://example.com/image.jpg',
    authorId: 'user123',
    createdAt: { seconds: 1672531200 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: null,
    });
  });

  const renderPostDetail = (slug = 'meu-post') => {
    return render(
      <MemoryRouter initialEntries={[`/posts/${slug}`]}>
        <Routes>
          <Route path="/posts/:slug" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve exibir loading enquanto carrega post', () => {
    postService.getPostBySlug.mockImplementation(
      () => new Promise(() => {})
    );

    renderPostDetail();

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('deve exibir post completo quando carregado', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);

    renderPostDetail();

    await waitFor(() => {
      expect(screen.getByText('Meu Post de Teste')).toBeInTheDocument();
      expect(screen.getByText(/Este é um/i)).toBeInTheDocument();
    });
  });

  it('deve renderizar conteúdo Markdown corretamente', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);

    renderPostDetail();

    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /título/i });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
    });
  });

  it('deve exibir imagem de capa quando presente', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);

    renderPostDetail();

    await waitFor(() => {
      const image = screen.getByAltText('Meu Post de Teste');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });
  });

  it('deve exibir tags como badges', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);

    renderPostDetail();

    await waitFor(() => {
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('javascript')).toBeInTheDocument();
    });
  });

  it('deve exibir data de criação formatada', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);

    renderPostDetail();

    await waitFor(() => {
      expect(screen.getByTestId('post-date')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro quando post não encontrado', async () => {
    postService.getPostBySlug.mockResolvedValue(null);

    renderPostDetail();

    await waitFor(() => {
      expect(screen.getByText(/post não encontrado/i)).toBeInTheDocument();
    });
  });

  it('deve exibir botões de editar e excluir para o autor', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);
    useAuth.mockReturnValue({
      user: { uid: 'user123', role: 'user' },
    });

    renderPostDetail();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
    });
  });

  it('deve exibir botões para admin mesmo não sendo autor', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);
    useAuth.mockReturnValue({
      user: { uid: 'admin456', role: 'admin' },
    });

    renderPostDetail();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
    });
  });

  it('não deve exibir botões para usuário não autor ou não admin', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);
    useAuth.mockReturnValue({
      user: { uid: 'other789', role: 'user' },
    });

    renderPostDetail();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument();
    });
  });

  it('não deve exibir botões quando usuário não autenticado', async () => {
    postService.getPostBySlug.mockResolvedValue(mockPost);
    useAuth.mockReturnValue({
      user: null,
    });

    renderPostDetail();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de erro quando carregamento falha', async () => {
    postService.getPostBySlug.mockRejectedValue(new Error('Erro ao carregar'));

    renderPostDetail();

    await waitFor(() => {
      expect(screen.getByText(/erro ao carregar post/i)).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';
import { usePosts } from '../hooks/usePosts';

vi.mock('../hooks/usePosts');

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir loading enquanto carrega posts', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('deve exibir lista de posts quando carregamento completo', () => {
    const mockPosts = [
      {
        id: '1',
        slug: 'post-1',
        title: 'Post 1',
        content: 'Conteúdo 1',
        tags: ['react'],
        createdAt: { seconds: 100 },
      },
      {
        id: '2',
        slug: 'post-2',
        title: 'Post 2',
        content: 'Conteúdo 2',
        tags: ['javascript'],
        createdAt: { seconds: 200 },
      },
    ];

    usePosts.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há posts', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/nenhum post encontrado/i)).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando carregamento falha', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: false,
      error: 'Erro ao carregar posts',
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByText(/erro ao carregar posts/i)).toBeInTheDocument();
  });

  it('deve renderizar título da página', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /posts recentes/i })).toBeInTheDocument();
  });

  it('deve usar hook usePosts com realtime habilitado', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(usePosts).toHaveBeenCalledWith({ realtime: true });
  });

  it('deve renderizar múltiplos PostCards para múltiplos posts', () => {
    const mockPosts = Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 1}`,
      slug: `post-${i + 1}`,
      title: `Post ${i + 1}`,
      content: `Conteúdo ${i + 1}`,
      tags: ['tag'],
      createdAt: { seconds: i * 100 },
    }));

    usePosts.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    mockPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });
});

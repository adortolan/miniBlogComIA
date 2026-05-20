import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';
import { usePosts } from '../hooks/usePosts';
import { usePostsByTag } from '../hooks/usePostsByTag';
import type { Post } from '../types';

vi.mock('../hooks/usePosts', () => ({
  usePosts: vi.fn(),
}));
vi.mock('../hooks/usePostsByTag', () => ({
  usePostsByTag: vi.fn(),
}));

describe('Home', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    (usePostsByTag as vi.Mock).mockReturnValue({
      posts: [],
      loading: false,
      error: null,
    });
  });

  it('deve exibir loading enquanto carrega posts', () => {
    (usePosts as vi.Mock).mockReturnValue({
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
    const mockPosts: Post[] = [
      {
        id: '1',
        slug: 'post-1',
        title: 'Post 1',
        content: 'Conteúdo 1',
        tags: ['react'],
        authorId: 'user1',
        createdAt: { seconds: 100, nanoseconds: 0 },
        updatedAt: { seconds: 100, nanoseconds: 0 },
      },
      {
        id: '2',
        slug: 'post-2',
        title: 'Post 2',
        content: 'Conteúdo 2',
        tags: ['javascript'],
        authorId: 'user2',
        createdAt: { seconds: 200, nanoseconds: 0 },
        updatedAt: { seconds: 200, nanoseconds: 0 },
      },
    ];

    (usePosts as vi.Mock).mockReturnValue({
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
    (usePosts as vi.Mock).mockReturnValue({
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
    (usePosts as vi.Mock).mockReturnValue({
      posts: [],
      loading: false,
      error: 'Erro ao carregar posts',
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/erro ao carregar posts/i)[0]).toBeInTheDocument();
  });

  it('deve renderizar título da página quando há posts', () => {
    const mockPosts: Post[] = [{
      id: '1',
      slug: 'post-1',
      title: 'Post 1',
      content: 'Conteúdo 1',
      tags: ['react'],
      authorId: 'user1',
      createdAt: { seconds: 100, nanoseconds: 0 },
      updatedAt: { seconds: 100, nanoseconds: 0 },
    }];

    (usePosts as vi.Mock).mockReturnValue({
      posts: mockPosts,
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
    (usePosts as vi.Mock).mockReturnValue({
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
    const mockPosts: Post[] = Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 1}`,
      slug: `post-${i + 1}`,
      title: `Post ${i + 1}`,
      content: `Conteúdo ${i + 1}`,
      tags: ['tag'],
      authorId: 'user1',
      createdAt: { seconds: i * 100, nanoseconds: 0 },
      updatedAt: { seconds: i * 100, nanoseconds: 0 },
    }));

    (usePosts as vi.Mock).mockReturnValue({
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

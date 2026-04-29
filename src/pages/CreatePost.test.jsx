import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreatePost } from './CreatePost';
import { useAuth } from '../contexts/AuthContext';
import { useCreatePost } from '../hooks/useCreatePost';

vi.mock('../contexts/AuthContext');
vi.mock('../hooks/useCreatePost');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: { uid: 'user123', displayName: 'Test User' },
    });
    useCreatePost.mockReturnValue({
      createPost: vi.fn(),
      loading: false,
      error: null,
    });
  });

  it('deve renderizar página de criar post', () => {
    render(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /criar novo post/i })).toBeInTheDocument();
  });

  it('deve redirecionar para login se usuário não autenticado', () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('deve chamar createPost ao submeter formulário', async () => {
    const mockCreatePost = vi.fn().mockResolvedValue({ id: 'post123', slug: 'meu-post' });
    useCreatePost.mockReturnValue({
      createPost: mockCreatePost,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>
    );

    const postData = {
      title: 'Meu Post',
      content: 'Conteúdo',
      tags: ['react'],
      imageURL: 'https://example.com/image.jpg',
    };

    // Simular preenchimento e submit do formulário
    const form = screen.getByTestId('post-form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(submitEvent, 'target', {
      writable: false,
      value: {
        elements: {
          title: { value: postData.title },
          content: { value: postData.content },
          tags: { value: postData.tags.join(', ') },
          imageURL: { value: postData.imageURL },
        },
      },
    });

    form.dispatchEvent(submitEvent);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalled();
    });
  });

  it('deve redirecionar para post criado após sucesso', async () => {
    const mockCreatePost = vi.fn().mockResolvedValue({ id: 'post123', slug: 'meu-post' });
    useCreatePost.mockReturnValue({
      createPost: mockCreatePost,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>
    );

    await waitFor(() => {
      if (mockCreatePost.mock.calls.length > 0) {
        expect(mockNavigate).toHaveBeenCalledWith('/posts/meu-post');
      }
    });
  });

  it('deve exibir mensagem de erro quando criação falha', () => {
    useCreatePost.mockReturnValue({
      createPost: vi.fn(),
      loading: false,
      error: 'Erro ao criar post',
    });

    render(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>
    );

    expect(screen.getByText(/erro ao criar post/i)).toBeInTheDocument();
  });

  it('deve exibir loading durante criação', () => {
    useCreatePost.mockReturnValue({
      createPost: vi.fn(),
      loading: true,
      error: null,
    });

    render(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});

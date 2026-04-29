import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CreatePost } from './CreatePost';
import { useAuth } from '../contexts/AuthContext';
import { useCreatePost } from '../hooks/useCreatePost';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../hooks/useCreatePost', () => ({
  useCreatePost: vi.fn(),
}));

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

    const titleInput = screen.getByPlaceholderText(/digite o título do post/i);
    const contentInput = screen.getByPlaceholderText(/escreva o conteúdo usando markdown/i);
    const tagsInput = screen.getByPlaceholderText(/react, javascript, typescript/i);
    const imageInput = screen.getByPlaceholderText(/https:\/\/exemplo.com\/imagem.jpg/i);

    fireEvent.change(titleInput, { target: { value: 'Meu Post' } });
    fireEvent.change(contentInput, { target: { value: 'Conteúdo' } });
    fireEvent.change(tagsInput, { target: { value: 'react' } });
    fireEvent.change(imageInput, { target: { value: 'https://example.com/image.jpg' } });

    const submitButton = screen.getByRole('button', { name: /publicar post/i });
    fireEvent.click(submitButton);

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

    const titleInput = screen.getByPlaceholderText(/digite o título do post/i);
    const contentInput = screen.getByPlaceholderText(/escreva o conteúdo usando markdown/i);

    fireEvent.change(titleInput, { target: { value: 'Meu Post' } });
    fireEvent.change(contentInput, { target: { value: 'Conteúdo do post' } });

    const submitButton = screen.getByRole('button', { name: /publicar post/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/posts/meu-post');
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

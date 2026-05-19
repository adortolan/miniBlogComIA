import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreatePost } from './useCreatePost';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { CreatePostDTO, Post } from '../types';

vi.mock('../services/postService');
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockPostService = vi.mocked(postService);
const mockUseAuth = vi.mocked(useAuth);

describe('useCreatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { uid: 'user123', displayName: 'Test User', email: 'test@example.com', photoURL: null, emailVerified: true },
      loading: false,
      isAuthenticated: true,
    });
  });

  it('deve criar post com sucesso', async () => {
    const mockPost: Omit<Post, 'createdAt' | 'updatedAt'> = { id: 'post123', slug: 'meu-post', title: 'Meu Post', content: 'Conteúdo', tags: ['react'], imageURL: 'https://example.com/image.jpg', authorId: 'user123' };
    mockPostService.createPost.mockResolvedValue(mockPost);
    mockPostService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useCreatePost());

    const postData: CreatePostDTO = {
      title: 'Meu Post',
      content: 'Conteúdo',
      tags: ['react'],
      imageURL: 'https://example.com/image.jpg',
    };

    await act(async () => {
      await result.current.createPost(postData);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(mockPostService.createPost).toHaveBeenCalledWith(
      expect.objectContaining({
        ...postData,
        authorId: 'user123',
        slug: expect.any(String),
      })
    );
  });

  it('deve definir loading como true durante criação', async () => {
    mockPostService.createPost.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ id: '1', slug: 'post-1', title: 'Post', content: 'Conteúdo', tags: [], authorId: 'user123' }), 100))
    );
    mockPostService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useCreatePost());

    act(() => {
      result.current.createPost({
        title: 'Post',
        content: 'Conteúdo',
        tags: [],
      });
    });

    expect(result.current.loading).toBe(true);
  });

  it('deve capturar erro ao falhar criação', async () => {
    const errorMessage = 'Erro ao criar post';
    mockPostService.createPost.mockRejectedValue(new Error(errorMessage));
    mockPostService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useCreatePost());

    await act(async () => {
      try {
        await result.current.createPost({
          title: 'Post',
          content: 'Conteúdo',
          tags: [],
        });
      } catch {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.loading).toBe(false);
    });
  });

  it('deve validar campos obrigatórios', async () => {
    const { result } = renderHook(() => useCreatePost());

    await act(async () => {
      try {
        await result.current.createPost({
          content: 'Conteúdo sem título',
          tags: [],
        });
      } catch {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('deve gerar slug único quando slug já existe', async () => {
    mockPostService.checkSlugUniqueness
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    mockPostService.createPost.mockResolvedValue({ id: 'post123', slug: 'meu-post', title: 'Meu Post', content: 'Conteúdo', tags: [], authorId: 'user123' });

    const { result } = renderHook(() => useCreatePost());

    await act(async () => {
      await result.current.createPost({
        title: 'Meu Post',
        content: 'Conteúdo',
        tags: [],
      });
    });

    expect(mockPostService.checkSlugUniqueness).toHaveBeenCalledTimes(2);
  });
});

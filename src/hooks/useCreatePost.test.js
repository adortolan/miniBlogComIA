import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreatePost } from './useCreatePost';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../services/postService');
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('useCreatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: { uid: 'user123', displayName: 'Test User' },
    });
  });

  it('deve criar post com sucesso', async () => {
    const mockPost = { id: 'post123', slug: 'meu-post' };
    postService.createPost.mockResolvedValue(mockPost);
    postService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useCreatePost());

    const postData = {
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

    expect(postService.createPost).toHaveBeenCalledWith(
      expect.objectContaining({
        ...postData,
        authorId: 'user123',
        slug: expect.any(String),
      })
    );
  });

  it('deve definir loading como true durante criação', async () => {
    postService.createPost.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ id: '1' }), 100))
    );
    postService.checkSlugUniqueness.mockResolvedValue(true);

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
    postService.createPost.mockRejectedValue(new Error(errorMessage));
    postService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useCreatePost());

    await act(async () => {
      try {
        await result.current.createPost({
          title: 'Post',
          content: 'Conteúdo',
          tags: [],
        });
      } catch (error) {
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
      } catch (error) {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('deve gerar slug único quando slug já existe', async () => {
    postService.checkSlugUniqueness
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    postService.createPost.mockResolvedValue({ id: 'post123' });

    const { result } = renderHook(() => useCreatePost());

    await act(async () => {
      await result.current.createPost({
        title: 'Meu Post',
        content: 'Conteúdo',
        tags: [],
      });
    });

    expect(postService.checkSlugUniqueness).toHaveBeenCalledTimes(2);
  });
});

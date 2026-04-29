import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUpdatePost } from './useUpdatePost';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../services/postService');
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('useUpdatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: { uid: 'user123', displayName: 'Test User' },
    });
  });

  it('deve atualizar post com sucesso', async () => {
    postService.updatePost.mockResolvedValue();
    postService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    const postId = 'post123';
    const postData = {
      title: 'Título Atualizado',
      content: 'Conteúdo atualizado',
      tags: ['react', 'typescript'],
      imageURL: 'https://example.com/new-image.jpg',
    };

    await act(async () => {
      await result.current.updatePost(postId, postData);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(postService.updatePost).toHaveBeenCalledWith(
      postId,
      expect.objectContaining({
        ...postData,
        slug: expect.any(String),
      })
    );
  });

  it('deve definir loading como true durante atualização', async () => {
    postService.updatePost.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    postService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    act(() => {
      result.current.updatePost('post123', {
        title: 'Título',
        content: 'Conteúdo',
        tags: [],
      });
    });

    expect(result.current.loading).toBe(true);
  });

  it('deve capturar erro ao falhar atualização', async () => {
    const errorMessage = 'Erro ao atualizar post';
    postService.updatePost.mockRejectedValue(new Error(errorMessage));
    postService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      try {
        await result.current.updatePost('post123', {
          title: 'Título',
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

  it('deve regenerar slug quando título muda', async () => {
    postService.updatePost.mockResolvedValue();
    postService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      await result.current.updatePost('post123', {
        title: 'Novo Título',
        content: 'Conteúdo',
        tags: [],
        oldSlug: 'titulo-antigo',
      });
    });

    expect(postService.updatePost).toHaveBeenCalledWith(
      'post123',
      expect.objectContaining({
        slug: 'novo-titulo',
      })
    );
  });

  it('deve verificar unicidade do novo slug excluindo post atual', async () => {
    postService.updatePost.mockResolvedValue();
    postService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      await result.current.updatePost('post123', {
        title: 'Título',
        content: 'Conteúdo',
        tags: [],
      });
    });

    expect(postService.checkSlugUniqueness).toHaveBeenCalledWith('titulo', 'post123');
  });

  it('deve gerar slug alternativo quando já existe', async () => {
    postService.checkSlugUniqueness
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    postService.updatePost.mockResolvedValue();

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      await result.current.updatePost('post123', {
        title: 'Título Existente',
        content: 'Conteúdo',
        tags: [],
      });
    });

    expect(postService.checkSlugUniqueness).toHaveBeenCalledTimes(2);
  });
});

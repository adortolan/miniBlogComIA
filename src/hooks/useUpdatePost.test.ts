import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useUpdatePost } from './useUpdatePost';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { UpdatePostDTO } from '../types';

vi.mock('../services/postService');
vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockPostService = vi.mocked(postService);
const mockUseAuth = vi.mocked(useAuth);

describe('useUpdatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { uid: 'user123', displayName: 'Test User', email: 'test@example.com', photoURL: null, emailVerified: true } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      loading: false,
      isAuthenticated: true,
    });
  });

  it('deve atualizar post com sucesso', async () => {
    mockPostService.updatePost.mockResolvedValue(undefined);
    mockPostService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    const postId = 'post123';
    const postData: UpdatePostDTO = {
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

    expect(mockPostService.updatePost).toHaveBeenCalledWith(
      postId,
      expect.objectContaining({
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        imageURL: postData.imageURL,
      })
    );
  });

  it('deve definir loading como true durante atualização', async () => {
    mockPostService.updatePost.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    mockPostService.checkSlugUniqueness.mockResolvedValue(true);

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
    mockPostService.updatePost.mockRejectedValue(new Error(errorMessage));
    mockPostService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      try {
        await result.current.updatePost('post123', {
          title: 'Título',
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
    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      try {
        await result.current.updatePost('post123', {
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

  it('deve validar ID do post', async () => {
    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      try {
        await result.current.updatePost('', {
          title: 'Título',
          content: 'Conteúdo',
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

  it('deve gerar novo slug quando título muda', async () => {
    mockPostService.updatePost.mockResolvedValue(undefined);
    mockPostService.checkSlugUniqueness.mockResolvedValue(true);

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      await result.current.updatePost('post123', {
        title: 'Novo Título',
        content: 'Conteúdo',
        tags: [],
        oldSlug: 'titulo-antigo'
      });
    });

    expect(mockPostService.updatePost).toHaveBeenCalledWith(
      'post123',
      expect.objectContaining({
        title: 'Novo Título',
        content: 'Conteúdo',
        tags: [],
        imageURL: undefined,
      })
    );
  });

  it('deve manter slug quando título não muda', async () => {
    mockPostService.updatePost.mockResolvedValue(undefined);

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      await result.current.updatePost('post123', {
        title: 'Título',
        content: 'Conteúdo atualizado',
        tags: [],
        oldSlug: 'titulo'
      });
    });

    expect(mockPostService.updatePost).toHaveBeenCalledWith(
      'post123',
      expect.objectContaining({
        title: 'Título',
        content: 'Conteúdo atualizado',
        tags: [],
        imageURL: undefined,
      })
    );
  });

  it('deve gerar slug único quando slug já existe', async () => {
    mockPostService.updatePost.mockResolvedValue(undefined);
    mockPostService.checkSlugUniqueness
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const { result } = renderHook(() => useUpdatePost());

    await act(async () => {
      await result.current.updatePost('post123', {
        title: 'Título',
        content: 'Conteúdo',
        tags: [],
        oldSlug: 'outro-titulo'
      });
    });

    expect(mockPostService.checkSlugUniqueness).toHaveBeenCalledTimes(2);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDeletePost } from './useDeletePost';
import { postService } from '../services/postService';

vi.mock('../services/postService');

describe('useDeletePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve excluir post com sucesso', async () => {
    postService.deletePost.mockResolvedValue();

    const { result } = renderHook(() => useDeletePost());

    const postId = 'post123';

    await act(async () => {
      await result.current.deletePost(postId);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(postService.deletePost).toHaveBeenCalledWith(postId);
  });

  it('deve definir loading como true durante exclusão', async () => {
    postService.deletePost.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useDeletePost());

    act(() => {
      result.current.deletePost('post123');
    });

    expect(result.current.loading).toBe(true);
  });

  it('deve capturar erro ao falhar exclusão', async () => {
    const errorMessage = 'Erro ao excluir post';
    postService.deletePost.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useDeletePost());

    await act(async () => {
      try {
        await result.current.deletePost('post123');
      } catch (error) {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.loading).toBe(false);
    });
  });

  it('deve resetar estado de erro ao chamar novamente', async () => {
    postService.deletePost
      .mockRejectedValueOnce(new Error('Erro'))
      .mockResolvedValueOnce();

    const { result } = renderHook(() => useDeletePost());

    await act(async () => {
      try {
        await result.current.deletePost('post123');
      } catch (error) {
        // Primeiro erro esperado
      }
    });

    expect(result.current.error).toBeTruthy();

    await act(async () => {
      await result.current.deletePost('post456');
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});

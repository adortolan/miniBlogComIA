import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from './usePosts';
import { postService } from '../services/postService';

vi.mock('../services/postService');

describe('usePosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar posts com sucesso', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Conteúdo 1',
        createdAt: { seconds: 200 },
      },
      {
        id: '2',
        title: 'Post 2',
        content: 'Conteúdo 2',
        createdAt: { seconds: 100 },
      },
    ];

    postService.getAllPosts.mockResolvedValue(mockPosts);

    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.error).toBeNull();
    });
  });

  it('deve iniciar com loading true', () => {
    postService.getAllPosts.mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);
    expect(result.current.posts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('deve capturar erro ao falhar carregamento', async () => {
    const errorMessage = 'Erro ao buscar posts';
    postService.getAllPosts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.posts).toEqual([]);
    });
  });

  it('deve se inscrever para atualizações em tempo real quando realtime é true', async () => {
    const mockUnsubscribe = vi.fn();
    const mockPosts = [
      {
        id: '1',
        title: 'Post 1',
        createdAt: { seconds: 100 },
      },
    ];

    postService.subscribeToPostsRealtime.mockImplementation((callback) => {
      callback(mockPosts);
      return mockUnsubscribe;
    });

    const { result, unmount } = renderHook(() => usePosts({ realtime: true }));

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.loading).toBe(false);
    });

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('deve retornar lista vazia quando não há posts', async () => {
    postService.getAllPosts.mockResolvedValue([]);

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});

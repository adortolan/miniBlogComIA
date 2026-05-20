import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from './usePosts';
import { postService } from '../services/postService';
import { Post } from '../types';

vi.mock('../services/postService');

// Criar um mock simples do Timestamp para uso nos testes
const createMockTimestamp = (seconds: number, nanoseconds: number) => ({
  seconds,
  nanoseconds,
  toDate: () => new Date(seconds * 1000 + nanoseconds / 1000000),
  toMillis: () => seconds * 1000 + nanoseconds / 1000000,
  isEqual: (other: unknown) => {
    const otherTimestamp = other as { seconds: number; nanoseconds: number };
    return seconds === otherTimestamp.seconds && nanoseconds === otherTimestamp.nanoseconds;
  },
  toJSON: () => ({ seconds, nanoseconds }),
  valueOf: () => (seconds * 1000 + nanoseconds / 1000000).toString(),
});

const mockPostService = vi.mocked(postService);

describe('usePosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar posts com sucesso', async () => {
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Conteúdo 1',
        slug: 'post-1',
        tags: [],
        authorId: 'user1',
        createdAt: createMockTimestamp(200, 0),
        updatedAt: createMockTimestamp(200, 0),
      },
      {
        id: '2',
        title: 'Post 2',
        content: 'Conteúdo 2',
        slug: 'post-2',
        tags: [],
        authorId: 'user2',
        createdAt: createMockTimestamp(100, 0),
        updatedAt: createMockTimestamp(100, 0),
      },
    ];

    mockPostService.getAllPosts.mockResolvedValue(mockPosts);

    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.error).toBeNull();
    });
  });

  it('deve iniciar com loading true', () => {
    mockPostService.getAllPosts.mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => usePosts());

    expect(result.current.loading).toBe(true);
    expect(result.current.posts).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('deve capturar erro ao falhar carregamento', async () => {
    const errorMessage = 'Erro ao buscar posts';
    mockPostService.getAllPosts.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.posts).toEqual([]);
    });
  });

  it('deve se inscrever para atualizações em tempo real quando realtime é true', async () => {
    const mockUnsubscribe = vi.fn();
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Conteúdo 1',
        slug: 'post-1',
        tags: [],
        authorId: 'user1',
        createdAt: createMockTimestamp(100, 0),
        updatedAt: createMockTimestamp(100, 0),
      },
    ];

    mockPostService.subscribeToPostsRealtime.mockImplementation((callback) => {
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
    mockPostService.getAllPosts.mockResolvedValue([]);

    const { result } = renderHook(() => usePosts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});

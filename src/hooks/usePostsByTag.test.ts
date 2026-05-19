import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePostsByTag } from './usePostsByTag';
import { postService } from '../services/postService';
import { Post } from '../types';

vi.mock('../services/postService');

// Criar um mock simples do Timestamp para uso nos testes
const createMockTimestamp = (seconds: number, nanoseconds: number) => ({
  seconds,
  nanoseconds,
  toDate: () => new Date(seconds * 1000 + nanoseconds / 1000000),
  toMillis: () => seconds * 1000 + nanoseconds / 1000000,
  isEqual: (other: any) => seconds === other.seconds && nanoseconds === other.nanoseconds,
  toJSON: () => ({ seconds, nanoseconds }),
  valueOf: () => (seconds * 1000 + nanoseconds / 1000000).toString(),
});

const mockPostService = vi.mocked(postService);

describe('usePostsByTag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar posts filtrados por tag com sucesso', async () => {
    const mockPosts: Post[] = [
      {
        id: '1',
        title: 'Post com React',
        content: 'Conteúdo',
        slug: 'post-com-react',
        tags: ['react', 'javascript'],
        authorId: 'user1',
        createdAt: createMockTimestamp(100, 0),
        updatedAt: createMockTimestamp(100, 0),
      },
      {
        id: '2',
        title: 'Outro post React',
        content: 'Conteúdo',
        slug: 'outro-post-react',
        tags: ['react', 'typescript'],
        authorId: 'user2',
        createdAt: createMockTimestamp(200, 0),
        updatedAt: createMockTimestamp(200, 0),
      },
    ];

    mockPostService.getPostsByTag.mockResolvedValue(mockPosts);

    const { result } = renderHook(() => usePostsByTag('react'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.error).toBeNull();
    });

    expect(mockPostService.getPostsByTag).toHaveBeenCalledWith('react');
  });

  it('deve retornar lista vazia quando não há posts com a tag', async () => {
    mockPostService.getPostsByTag.mockResolvedValue([]);

    const { result } = renderHook(() => usePostsByTag('nonexistent'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  it('deve capturar erro ao falhar carregamento', async () => {
    const errorMessage = 'Erro ao buscar posts';
    mockPostService.getPostsByTag.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePostsByTag('react'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.posts).toEqual([]);
    });
  });

  it('deve recarregar posts quando tag muda', async () => {
    const mockPostsReact: Post[] = [{ 
      id: '1', 
      title: 'Post React',
      content: 'Conteúdo',
      slug: 'post-react',
      tags: ['react'],
      authorId: 'user1',
      createdAt: createMockTimestamp(100, 0),
      updatedAt: createMockTimestamp(100, 0),
    }];
    const mockPostsVue: Post[] = [{ 
      id: '2', 
      title: 'Post Vue',
      content: 'Conteúdo',
      slug: 'post-vue',
      tags: ['vue'],
      authorId: 'user2',
      createdAt: createMockTimestamp(200, 0),
      updatedAt: createMockTimestamp(200, 0),
    }];

    mockPostService.getPostsByTag
      .mockResolvedValueOnce(mockPostsReact)
      .mockResolvedValueOnce(mockPostsVue);

    const { result, rerender } = renderHook(
      ({ tag }) => usePostsByTag(tag),
      { initialProps: { tag: 'react' } }
    );

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPostsReact);
    });

    rerender({ tag: 'vue' });

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPostsVue);
    });

    expect(mockPostService.getPostsByTag).toHaveBeenCalledTimes(2);
  });

  it('não deve fazer busca quando tag é null ou undefined', () => {
    renderHook(() => usePostsByTag(null));

    expect(mockPostService.getPostsByTag).not.toHaveBeenCalled();
  });
});

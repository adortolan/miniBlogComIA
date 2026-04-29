import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePostsByTag } from './usePostsByTag';
import { postService } from '../services/postService';

vi.mock('../services/postService');

describe('usePostsByTag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar posts filtrados por tag com sucesso', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Post com React',
        tags: ['react', 'javascript'],
        createdAt: { seconds: 100 },
      },
      {
        id: '2',
        title: 'Outro post React',
        tags: ['react', 'typescript'],
        createdAt: { seconds: 200 },
      },
    ];

    postService.getPostsByTag.mockResolvedValue(mockPosts);

    const { result } = renderHook(() => usePostsByTag('react'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.error).toBeNull();
    });

    expect(postService.getPostsByTag).toHaveBeenCalledWith('react');
  });

  it('deve retornar lista vazia quando não há posts com a tag', async () => {
    postService.getPostsByTag.mockResolvedValue([]);

    const { result } = renderHook(() => usePostsByTag('nonexistent'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.posts).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  it('deve capturar erro ao falhar carregamento', async () => {
    const errorMessage = 'Erro ao buscar posts';
    postService.getPostsByTag.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePostsByTag('react'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.posts).toEqual([]);
    });
  });

  it('deve recarregar posts quando tag muda', async () => {
    const mockPostsReact = [{ id: '1', tags: ['react'] }];
    const mockPostsVue = [{ id: '2', tags: ['vue'] }];

    postService.getPostsByTag
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

    expect(postService.getPostsByTag).toHaveBeenCalledTimes(2);
  });

  it('não deve fazer busca quando tag é null ou undefined', () => {
    renderHook(() => usePostsByTag(null));

    expect(postService.getPostsByTag).not.toHaveBeenCalled();
  });
});

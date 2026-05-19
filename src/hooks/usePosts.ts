import { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import { Post } from '../types';

interface UsePostsOptions {
  realtime?: boolean;
}

/**
 * Hook para gerenciar busca de posts
 * @param {UsePostsOptions} options - Opções do hook
 * @returns {Object} - Estado dos posts
 */
export const usePosts = (options: UsePostsOptions = {}) => {
  const { realtime = false }: UsePostsOptions = options;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (realtime) {
      const unsubscribe = postService.subscribeToPostsRealtime(
        (updatedPosts: Post[]) => {
          setPosts(updatedPosts);
          setLoading(false);
          setError(null);
        },
        (err: Error) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      const fetchPosts = async () => {
        setLoading(true);
        setError(null);

        try {
          const fetchedPosts = await postService.getAllPosts();
          setPosts(fetchedPosts);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar posts';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [realtime]);

  return {
    posts,
    loading,
    error,
  };
};

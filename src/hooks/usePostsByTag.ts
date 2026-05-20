import { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import { Post } from '../types';

/**
 * Hook para buscar posts filtrados por tag
 * @param {string | null} tag - Tag para filtrar
 * @returns {Object} - Estado dos posts filtrados
 */
export const usePostsByTag = (tag: string | null) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tag) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedPosts = await postService.getPostsByTag(tag);
        setPosts(fetchedPosts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar posts por tag';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);

  return {
    posts,
    loading,
    error,
  };
};

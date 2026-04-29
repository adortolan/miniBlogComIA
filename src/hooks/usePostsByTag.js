import { useState, useEffect } from 'react';
import { postService } from '../services/postService';

/**
 * Hook para buscar posts filtrados por tag
 * @param {string} tag - Tag para filtrar
 * @returns {Object} - Estado dos posts filtrados
 */
export const usePostsByTag = (tag) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setError(err.message);
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

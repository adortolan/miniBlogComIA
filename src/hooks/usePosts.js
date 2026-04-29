import { useState, useEffect } from 'react';
import { postService } from '../services/postService';

/**
 * Hook para gerenciar busca de posts
 * @param {Object} options - Opções do hook
 * @param {boolean} options.realtime - Se deve usar atualização em tempo real
 * @returns {Object} - Estado dos posts
 */
export const usePosts = (options = {}) => {
  const { realtime = false } = options;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (realtime) {
      const unsubscribe = postService.subscribeToPostsRealtime((updatedPosts) => {
        setPosts(updatedPosts);
        setLoading(false);
        setError(null);
      });

      return () => unsubscribe();
    } else {
      const fetchPosts = async () => {
        setLoading(true);
        setError(null);

        try {
          const fetchedPosts = await postService.getAllPosts();
          setPosts(fetchedPosts);
        } catch (err) {
          setError(err.message);
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

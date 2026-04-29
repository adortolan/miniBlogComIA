import { useState } from 'react';
import { postService } from '../services/postService';

/**
 * Hook para gerenciar exclusão de posts
 * @returns {Object} - Estado e função para excluir post
 */
export const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Exclui um post
   * @param {string} postId - ID do post
   * @returns {Promise<void>}
   */
  const deletePost = async (postId) => {
    setLoading(true);
    setError(null);

    try {
      await postService.deletePost(postId);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    deletePost,
    loading,
    error,
  };
};

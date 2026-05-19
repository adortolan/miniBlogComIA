import { useState } from 'react';
import { postService } from '../services/postService';

/**
 * Hook para gerenciar exclusão de posts
 * @returns {Object} - Estado e função para excluir post
 */
export const useDeletePost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Exclui um post
   * @param {string} postId - ID do post
   * @returns {Promise<void>}
   */
  const deletePost = async (postId: string): Promise<void> => {
    if (!postId) {
      const validationError = new Error('ID do post é obrigatório');
      setError(validationError.message);
      throw validationError;
    }

    setLoading(true);
    setError(null);

    try {
      await postService.deletePost(postId);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao excluir post';
      setError(errorMessage);
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

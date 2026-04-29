import { useState } from 'react';
import { postService } from '../services/postService';
import { generateSlug } from '../utils/generateSlug';

/**
 * Hook para gerenciar atualização de posts
 * @returns {Object} - Estado e função para atualizar post
 */
export const useUpdatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Atualiza um post existente
   * @param {string} postId - ID do post
   * @param {Object} postData - Dados atualizados
   * @returns {Promise<Object>} - Post atualizado
   */
  const updatePost = async (postId, postData) => {
    if (!postData.title || !postData.content) {
      const validationError = new Error('Título e conteúdo são obrigatórios');
      setError(validationError.message);
      throw validationError;
    }

    setLoading(true);
    setError(null);

    try {
      let slug = generateSlug(postData.title);
      
      // Verificar se o slug mudou ou se é único
      if (slug !== postData.oldSlug) {
        let isUnique = await postService.checkSlugUniqueness(slug, postId);
        let counter = 1;

        while (!isUnique) {
          slug = `${generateSlug(postData.title)}-${counter}`;
          isUnique = await postService.checkSlugUniqueness(slug, postId);
          counter++;
        }
      }

      const updateData = {
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        imageURL: postData.imageURL,
        slug,
      };

      await postService.updatePost(postId, updateData);

      setLoading(false);
      return { ...updateData, id: postId };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    updatePost,
    loading,
    error,
  };
};

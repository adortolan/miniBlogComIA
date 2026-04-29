import { useState } from 'react';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { generateSlug } from '../utils/generateSlug';

/**
 * Hook para gerenciar criação de posts
 * @returns {Object} - Estado e função para criar post
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  /**
   * Cria um novo post
   * @param {Object} postData - Dados do post
   * @returns {Promise<Object>} - Post criado
   */
  const createPost = async (postData) => {
    if (!postData.title || !postData.content) {
      const validationError = new Error('Título e conteúdo são obrigatórios');
      setError(validationError.message);
      throw validationError;
    }

    setLoading(true);
    setError(null);

    try {
      let slug = generateSlug(postData.title);
      let isUnique = await postService.checkSlugUniqueness(slug);
      let counter = 1;
      const MAX_ATTEMPTS = 100;

      while (!isUnique && counter < MAX_ATTEMPTS) {
        slug = `${generateSlug(postData.title)}-${counter}`;
        isUnique = await postService.checkSlugUniqueness(slug);
        counter++;
      }

      if (!isUnique) {
        throw new Error('Não foi possível gerar um slug único. Tente um título diferente.');
      }

      const post = await postService.createPost({
        ...postData,
        slug,
        authorId: user.uid,
      });

      setLoading(false);
      return post;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    createPost,
    loading,
    error,
  };
};

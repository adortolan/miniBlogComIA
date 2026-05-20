import { useState } from 'react';
import { postService } from '../services/postService';
import { generateSlug } from '../utils/generateSlug';
import { UpdatePostDTO, Post } from '../types';

interface UpdatePostData extends UpdatePostDTO {
  oldSlug?: string;
}

/**
 * Hook para gerenciar atualização de posts
 * @returns {Object} - Estado e função para atualizar post
 */
export const useUpdatePost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Atualiza um post existente
   * @param {string} postId - ID do post
   * @param {UpdatePostData} postData - Dados atualizados
   * @returns {Promise<Partial<Post>>} - Post atualizado
   */
  const updatePost = async (postId: string, postData: UpdatePostData): Promise<Partial<Post>> => {
    if (!postId) {
      const validationError = new Error('ID do post é obrigatório');
      setError(validationError.message);
      throw validationError;
    }

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
        const MAX_ATTEMPTS = 100;

        while (!isUnique && counter < MAX_ATTEMPTS) {
          slug = `${generateSlug(postData.title)}-${counter}`;
          isUnique = await postService.checkSlugUniqueness(slug, postId);
          counter++;
        }

        if (!isUnique) {
          throw new Error('Não foi possível gerar um slug único. Tente um título diferente.');
        }
      }

      const updateData: UpdatePostDTO = {
        title: postData.title,
        content: postData.content,
        tags: postData.tags || [],
      };

      // Só inclui imageURL se tiver um valor válido
      if (postData.imageURL) {
        updateData.imageURL = postData.imageURL;
      }

      // Inclui o slug se foi gerado um novo
      if (slug !== postData.oldSlug) {
        updateData.slug = slug;
      }

      await postService.updatePost(postId, updateData);

      setLoading(false);
      return { ...updateData, id: postId, slug: slug };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao atualizar post';
      setError(errorMessage);
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

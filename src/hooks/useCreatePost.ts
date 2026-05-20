import { useState } from 'react';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { generateSlug } from '../utils/generateSlug';
import { CreatePostDTO, Post } from '../types';

/**
 * Hook para gerenciar criação de posts
 * @returns {Object} - Estado e função para criar post
 */
export const useCreatePost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  /**
   * Cria um novo post
   * @param {CreatePostDTO} postData - Dados do post
   * @returns {Promise<Omit<Post, 'createdAt' | 'updatedAt'>>} - Post criado
   */
  const createPost = async (postData: CreatePostDTO): Promise<Omit<Post, 'createdAt' | 'updatedAt'>> => {
    if (!postData.title || !postData.content) {
      const validationError = new Error('Título e conteúdo são obrigatórios');
      setError(validationError.message);
      throw validationError;
    }

    if (!user?.uid) {
      const authError = new Error('Usuário não autenticado');
      setError(authError.message);
      throw authError;
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
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar post';
      setError(errorMessage);
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

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCreatePost } from '../hooks/useCreatePost';
import { PostForm } from '../components/PostForm';
import type { CreatePostDTO, UpdatePostDTO } from '../types';

/**
 * Página para criar um novo post
 * Acessível apenas para usuários autenticados
 */
export const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost, loading, error } = useCreatePost();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (postData: CreatePostDTO | UpdatePostDTO) => {
    try {
      const createdPost = await createPost(postData as CreatePostDTO);
      navigate(`/posts/${createdPost.slug}`);
    } catch (err) {
      console.error('Erro ao criar post:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800 px-4 py-8">
      <div className="max-w-4xl w-full space-y-8 bg-dark-700 p-8 rounded-xl border border-dark-600">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Criar Novo Post
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Compartilhe suas ideias e conhecimentos com a comunidade
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded relative">
            <span className="block sm:inline">Erro ao criar post: {error}</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center" data-testid="loading-indicator">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
            <span className="ml-3 text-gray-400">Criando post...</span>
          </div>
        )}

        <PostForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

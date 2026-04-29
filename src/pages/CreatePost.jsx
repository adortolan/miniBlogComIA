import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCreatePost } from '../hooks/useCreatePost';
import { PostForm } from '../components/PostForm';

/**
 * Página para criar um novo post
 * Acessível apenas para usuários autenticados
 * @returns {JSX.Element}
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

  const handleSubmit = async (postData) => {
    try {
      const createdPost = await createPost(postData);
      navigate(`/posts/${createdPost.slug}`);
    } catch (err) {
      console.error('Erro ao criar post:', err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Criar Novo Post</h1>
        <p className="text-gray-600">
          Compartilhe suas ideias e conhecimentos com a comunidade
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">Erro ao criar post: {error}</p>
        </div>
      )}

      {loading && (
        <div className="mb-6 flex items-center justify-center" data-testid="loading-indicator">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Criando post...</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <PostForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

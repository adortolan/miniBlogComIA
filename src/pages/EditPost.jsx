import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUpdatePost } from '../hooks/useUpdatePost';
import { useUserRole } from '../hooks/useUserRole';
import { postService } from '../services/postService';
import { PostForm } from '../components/PostForm';

/**
 * Página para editar um post existente
 * Acessível apenas para o autor do post ou admin
 * @returns {JSX.Element}
 */
export const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updatePost, loading: updating, error: updateError } = useUpdatePost();
  const { isAdmin, loading: loadingRole } = useUserRole(user?.uid);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedPost = await postService.getPostById(id);
        
        if (!fetchedPost) {
          setError('Post não encontrado');
          setPost(null);
        } else {
          setPost(fetchedPost);
        }
      } catch (err) {
        setError('Erro ao carregar post');
        console.error('Erro ao buscar post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  useEffect(() => {
    if (post && !loadingRole && user) {
      const canEdit = user.uid === post.authorId || isAdmin;
      
      if (!canEdit) {
        navigate('/');
      }
    }
  }, [post, loadingRole, isAdmin, user, navigate]);

  const handleSubmit = async (postData) => {
    try {
      const updatedPost = await updatePost(id, {
        ...postData,
        oldSlug: post.slug,
      });
      navigate(`/posts/${updatedPost.slug}`);
    } catch (err) {
      console.error('Erro ao atualizar post:', err);
    }
  };

  if (!user) {
    return null;
  }

  if (loading || loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800 px-4">
        <div className="text-center" data-testid="loading-indicator">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
          <p className="text-gray-400 text-lg">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800 px-4">
        <div className="bg-dark-700 border border-dark-600 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-white text-2xl font-bold mb-2">
            {error || 'Post não encontrado'}
          </h2>
          <p className="text-gray-400 mb-4">
            O post que você está tentando editar não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800 px-4 py-8">
      <div className="max-w-4xl w-full space-y-8 bg-dark-700 p-8 rounded-xl border border-dark-600">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Editar Post
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Atualize as informações do seu post
          </p>
        </div>

        {updateError && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded relative">
            <span className="block sm:inline">Erro ao atualizar post: {updateError}</span>
          </div>
        )}

        {updating && (
          <div className="flex items-center justify-center" data-testid="loading-indicator">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
            <span className="ml-3 text-gray-400">Atualizando post...</span>
          </div>
        )}

        <PostForm
          onSubmit={handleSubmit}
          loading={updating}
          initialData={{
            title: post.title,
            content: post.content,
            tags: post.tags,
            imageURL: post.imageURL,
          }}
        />
      </div>
    </div>
  );
};

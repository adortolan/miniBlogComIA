import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUpdatePost } from '../hooks/useUpdatePost';
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
          // Verificar permissão
          const canEdit = user.uid === fetchedPost.authorId || user.role === 'admin';
          
          if (!canEdit) {
            navigate('/');
            return;
          }
          
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center" data-testid="loading-indicator">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-red-800 text-2xl font-bold mb-2">
            {error || 'Post não encontrado'}
          </h2>
          <p className="text-red-700 mb-4">
            O post que você está tentando editar não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Editar Post</h1>
        <p className="text-gray-600">
          Atualize as informações do seu post
        </p>
      </div>

      {updateError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">
            Erro ao atualizar post: {updateError}
          </p>
        </div>
      )}

      {updating && (
        <div className="mb-6 flex items-center justify-center" data-testid="loading-indicator">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Atualizando post...</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
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

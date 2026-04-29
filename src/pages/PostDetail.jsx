import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { useDeletePost } from '../hooks/useDeletePost';
import { formatDate } from '../utils/formatDate';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

/**
 * Página de detalhes de um post individual
 * Acesso público, mas com ações restritas para autor/admin
 * @returns {JSX.Element}
 */
export const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deletePost, loading: deleting } = useDeletePost();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedPost = await postService.getPostBySlug(slug);
        
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
  }, [slug]);

  const canEditOrDelete = () => {
    if (!user || !post) return false;
    return user.uid === post.authorId || user.role === 'admin';
  };

  const handleEdit = () => {
    navigate(`/admin/posts/edit/${post.id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePost(post.id);
      navigate('/');
    } catch (err) {
      console.error('Erro ao excluir post:', err);
      setShowDeleteModal(false);
    }
  };

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
          <svg
            className="mx-auto h-16 w-16 text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-red-800 text-2xl font-bold mb-2">
            {error || 'Post não encontrado'}
          </h2>
          <p className="text-red-700 mb-4">
            O post que você está procurando não existe ou foi removido.
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
    <div className="min-h-screen bg-gray-50 py-8">
      <article className="max-w-4xl mx-auto px-4">
        {post.imageURL && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={post.imageURL}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
              <span data-testid="post-date">
                {formatDate(post.createdAt)}
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => navigate(`/?tag=${tag}`)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {canEditOrDelete() && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Excluir
                </button>
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        postTitle={post.title}
        loading={deleting}
      />
    </div>
  );
};

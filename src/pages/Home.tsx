import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { usePostsByTag } from '../hooks/usePostsByTag';
import { PostCard } from '../components/PostCard';
import { TagFilter } from '../components/TagFilter';
import type { Post } from '../types';

/**
 * Página principal que exibe lista de posts
 * Acesso público (não requer autenticação)
 */
export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');
  
  const { posts: allPosts, loading: loadingAll, error: errorAll } = usePosts({ realtime: true });
  const { posts: tagPosts, loading: loadingTag, error: errorTag } = usePostsByTag(selectedTag);

  const posts: Post[] = selectedTag ? tagPosts : allPosts;
  const loading = selectedTag ? loadingTag : loadingAll;
  const error = selectedTag ? errorTag : errorAll;

  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allPosts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [allPosts]);

  const handleTagSelect = (tag: string | null) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800">
        <div className="text-center" data-testid="loading-indicator">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
          <p className="text-gray-400 text-lg">Carregando posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 className="text-red-400 text-xl font-bold mb-2">
            Erro ao carregar posts
          </h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-800">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-gray-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">
            Nenhum post encontrado
          </h2>
          <p className="text-gray-400">
            Seja o primeiro a criar um post!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {selectedTag ? `Posts sobre "${selectedTag}"` : 'Posts Recentes'}
          </h1>
          <p className="text-gray-400">
            {selectedTag 
              ? `Exibindo posts filtrados pela tag "${selectedTag}"`
              : 'Explore os últimos artigos e tutoriais da nossa comunidade'}
          </p>
        </div>

        {availableTags.length > 0 && (
          <TagFilter
            tags={availableTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

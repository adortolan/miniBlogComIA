import { Link, useNavigate } from 'react-router-dom';
import { formatRelativeDate } from '../utils/formatDate';
import type { Post } from '../types';
import type { MouseEvent } from 'react';

interface PostCardProps {
  post: Post;
}

/**
 * Componente de card para exibir preview de um post
 * @param props - Props do componente
 * @returns JSX.Element
 */
export const PostCard = ({ post }: PostCardProps) => {
  const navigate = useNavigate();
  const { slug, title, content, tags, imageURL, createdAt } = post;

  const handleTagClick = (e: MouseEvent<HTMLSpanElement>, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/?tag=${tag}`);
  };

  const createExcerpt = (text: string, maxLength = 150): string => {
    const cleanText = text.replace(/[#*`[\]()]/g, '').trim();
    
    if (cleanText.length <= maxLength) {
      return cleanText;
    }

    return cleanText.substring(0, maxLength).trim() + '...';
  };

  return (
    <Link to={`/posts/${slug}`} className="block">
      <article className="bg-dark-700 rounded-lg border border-dark-600 overflow-hidden hover:border-primary-400 transition-all duration-300">
        {imageURL && (
          <div className="h-48 overflow-hidden">
            <img
              src={imageURL}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-3 hover:text-primary-400 transition-colors">
            {title}
          </h2>

          <p
            className="text-gray-400 mb-4 leading-relaxed"
            data-testid="post-excerpt"
          >
            {createExcerpt(content)}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  onClick={(e) => handleTagClick(e, tag)}
                  className="px-3 py-1 bg-purple-900/30 text-purple-300 text-sm rounded-full font-medium cursor-pointer hover:bg-purple-900/50 transition-colors border border-purple-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span data-testid="post-date">
              {formatRelativeDate(createdAt)}
            </span>
            <span className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
              Ler mais →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

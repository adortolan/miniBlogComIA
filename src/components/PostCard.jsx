import { Link } from 'react-router-dom';
import { formatRelativeDate } from '../utils/formatDate';

/**
 * Componente de card para exibir preview de um post
 * @param {Object} props - Props do componente
 * @param {Object} props.post - Dados do post
 * @returns {JSX.Element}
 */
export const PostCard = ({ post }) => {
  const { slug, title, content, tags, imageURL, createdAt } = post;

  const createExcerpt = (text, maxLength = 150) => {
    const cleanText = text.replace(/[#*`\[\]()]/g, '').trim();
    
    if (cleanText.length <= maxLength) {
      return cleanText;
    }

    return cleanText.substring(0, maxLength).trim() + '...';
  };

  return (
    <Link to={`/posts/${slug}`} className="block">
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
            {title}
          </h2>

          <p
            className="text-gray-700 mb-4 leading-relaxed"
            data-testid="post-excerpt"
          >
            {createExcerpt(content)}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
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
            <span className="text-blue-600 font-medium hover:underline">
              Ler mais →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

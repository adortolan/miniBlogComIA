import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de formulário reutilizável para criar/editar posts
 * @param {Object} props - Props do componente
 * @param {Function} props.onSubmit - Função chamada ao submeter
 * @param {boolean} props.loading - Estado de loading
 * @param {Object} props.initialData - Dados iniciais para pré-preencher
 * @returns {JSX.Element}
 */
export const PostForm = ({ onSubmit, loading = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    imageURL: '',
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        imageURL: initialData.imageURL || '',
      });
      if (initialData.imageURL) {
        setShowPreview(true);
      }
    }
  }, [initialData]);

  const validateURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'imageURL') {
      setShowPreview(validateURL(value) && value.length > 0);
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    }

    if (formData.imageURL && !validateURL(formData.imageURL)) {
      newErrors.imageURL = 'URL inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    onSubmit({
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags,
      imageURL: formData.imageURL.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="post-form" className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite o título do post"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Conteúdo * (Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={12}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Escreva o conteúdo usando Markdown..."
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        <p className="mt-1 text-sm text-gray-500">
          Suporta Markdown: títulos (#), listas, código, links, etc.
        </p>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="react, javascript, typescript (separadas por vírgula)"
        />
        <p className="mt-1 text-sm text-gray-500">
          Separe as tags por vírgula. Ex: react, javascript, tutorial
        </p>
      </div>

      <div>
        <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700 mb-2">
          URL da Imagem de Capa
        </label>
        <input
          type="text"
          id="imageURL"
          name="imageURL"
          value={formData.imageURL}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.imageURL ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://exemplo.com/imagem.jpg"
        />
        {errors.imageURL && <p className="mt-1 text-sm text-red-600">{errors.imageURL}</p>}

        {showPreview && formData.imageURL && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={formData.imageURL}
              alt="Preview da imagem de capa"
              className="max-w-full h-auto rounded-lg border border-gray-300"
              onError={() => setShowPreview(false)}
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Publicando...' : 'Publicar Post'}
        </button>
      </div>
    </form>
  );
};

PostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    imageURL: PropTypes.string,
  }),
};

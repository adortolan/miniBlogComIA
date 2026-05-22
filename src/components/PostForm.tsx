import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { validateImageUrl } from '../utils/imageValidation';
import type { CreatePostDTO, UpdatePostDTO, Post } from '../types';

interface PostFormProps {
  onSubmit: (data: CreatePostDTO | UpdatePostDTO) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<Post>;
}

interface FormData {
  title: string;
  content: string;
  tags: string;
  imageURL: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  imageURL?: string;
}

/**
 * Componente de formulário reutilizável para criar/editar posts
 * @param props - Props do componente
 * @returns JSX.Element
 */
export const PostForm = ({ onSubmit, loading = false, initialData }: PostFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    tags: '',
    imageURL: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        tags: (initialData.tags && Array.isArray(initialData.tags)) ? initialData.tags.join(', ') : '',
        imageURL: initialData.imageURL || '',
      });
      if (initialData.imageURL) {
        setShowPreview(true);
      }
    }
  }, [initialData]);

  const validateURL = (url: string): { isValid: boolean; error?: string } => {
    if (!url) return { isValid: true };
    return validateImageUrl(url);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'imageURL') {
      const validation = validateURL(value);
      setShowPreview(validation.isValid && value.length > 0);
      if (!validation.isValid && value.length > 0) {
        setErrors((prev) => ({ ...prev, imageURL: validation.error }));
      }
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    }

    if (formData.imageURL) {
      const imageValidation = validateURL(formData.imageURL);
      if (!imageValidation.isValid) {
        newErrors.imageURL = imageValidation.error || 'URL inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    const submitData: CreatePostDTO | UpdatePostDTO = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags,
    };

    // Só inclui imageURL se tiver um valor válido
    if (formData.imageURL.trim()) {
      submitData.imageURL = formData.imageURL.trim();
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="post-form" className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Título *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 bg-dark-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-dark-600'
          }`}
          placeholder="Digite o título do post"
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300">
          Conteúdo * (Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={2}
          className={`mt-1 block w-full px-3 py-2 bg-dark-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
            errors.content ? 'border-red-500' : 'border-dark-600'
          }`}
          placeholder="Escreva o conteúdo usando Markdown..."
        />
        {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content}</p>}
        <p className="mt-1 text-sm text-gray-400">
          Suporta Markdown: títulos (#), listas, código, links, etc.
        </p>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="react, javascript, typescript (separadas por vírgula)"
        />
        <p className="mt-1 text-sm text-gray-400">
          Separe as tags por vírgula. Ex: react, javascript, tutorial
        </p>
      </div>

      <div>
        <label htmlFor="imageURL" className="block text-sm font-medium text-gray-300">
          URL da Imagem de Capa
        </label>
        <input
          type="text"
          id="imageURL"
          name="imageURL"
          value={formData.imageURL}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 bg-dark-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
            errors.imageURL ? 'border-red-500' : 'border-dark-600'
          }`}
          placeholder="https://exemplo.com/imagem.jpg"
        />
        {errors.imageURL && <p className="mt-1 text-sm text-red-400">{errors.imageURL}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Domínios permitidos: Unsplash, Imgur, Firebase Storage, GitHub, Cloudinary
        </p>

        {showPreview && formData.imageURL && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-300 mb-2">Preview:</p>
            <img
              src={formData.imageURL}
              alt="Preview da imagem de capa"
              className="max-w-full h-auto rounded-lg border border-dark-600"
              onError={() => setShowPreview(false)}
            />
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Publicando...' : 'Publicar Post'}
        </button>
      </div>
    </form>
  );
};

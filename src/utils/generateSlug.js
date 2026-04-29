/**
 * Gera um slug URL-friendly a partir de um título
 * @param {string} title - Título do post
 * @returns {string} - Slug gerado
 */
export const generateSlug = (title) => {
  if (!title || typeof title !== 'string') {
    return '';
  }

  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

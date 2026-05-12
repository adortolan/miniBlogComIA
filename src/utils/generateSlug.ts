/**
 * Gera um slug URL-friendly a partir de um título
 */
export const generateSlug = (title: string): string => {
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

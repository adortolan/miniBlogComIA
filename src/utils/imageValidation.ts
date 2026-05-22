/**
 * Utilitário para validação de URLs de imagens.
 * Implementa whitelist de domínios confiáveis para prevenir SSRF e tracking.
 */

/**
 * Lista de domínios permitidos para imagens.
 * Adicione domínios confiáveis conforme necessário.
 */
const ALLOWED_IMAGE_DOMAINS = [
  // Serviços de imagem populares
  'images.unsplash.com',
  'unsplash.com',
  'i.imgur.com',
  'imgur.com',
  'picsum.photos',
  'placekitten.com',
  'placehold.co',
  'via.placeholder.com',
  
  // Firebase Storage
  'firebasestorage.googleapis.com',
  'storage.googleapis.com',
  
  // CDNs populares
  'cdn.jsdelivr.net',
  'raw.githubusercontent.com',
  'avatars.githubusercontent.com',
  
  // Serviços de blog/dev
  'dev-to-uploads.s3.amazonaws.com',
  'res.cloudinary.com',
  'media.dev.to',
  
  // Imagens do projeto (adicione seu domínio de produção)
  'miniblog-261e2.web.app',
  'miniblog-261e2.firebaseapp.com',
];

/**
 * Extensões de arquivo de imagem permitidas
 */
const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
];

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

/**
 * Valida se uma URL de imagem é de um domínio permitido
 * @param url - URL da imagem a ser validada
 * @param strictMode - Se true, requer que a URL termine com extensão de imagem
 * @returns Resultado da validação
 */
export const validateImageUrl = (
  url: string,
  strictMode = false
): ImageValidationResult => {
  // URL vazia é válida (campo opcional)
  if (!url || url.trim() === '') {
    return { isValid: true, sanitizedUrl: '' };
  }

  const trimmedUrl = url.trim();

  // Validar formato da URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    return {
      isValid: false,
      error: 'URL inválida. Verifique o formato.',
    };
  }

  // Verificar protocolo (apenas HTTPS em produção)
  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    return {
      isValid: false,
      error: 'URL deve usar protocolo HTTP ou HTTPS.',
    };
  }

  // Verificar se o domínio está na whitelist
  const hostname = parsedUrl.hostname.toLowerCase();
  const isAllowedDomain = ALLOWED_IMAGE_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (!isAllowedDomain) {
    return {
      isValid: false,
      error: `Domínio não permitido. Use imagens de: ${ALLOWED_IMAGE_DOMAINS.slice(0, 5).join(', ')}...`,
    };
  }

  // Verificar extensão de arquivo (modo estrito)
  if (strictMode) {
    const pathname = parsedUrl.pathname.toLowerCase();
    const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
      pathname.endsWith(ext)
    );

    if (!hasValidExtension) {
      return {
        isValid: false,
        error: `Extensão de arquivo não permitida. Use: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
      };
    }
  }

  return {
    isValid: true,
    sanitizedUrl: trimmedUrl,
  };
};

/**
 * Verifica se um domínio está na whitelist
 * @param hostname - Hostname a verificar
 * @returns true se o domínio é permitido
 */
export const isAllowedImageDomain = (hostname: string): boolean => {
  const normalizedHostname = hostname.toLowerCase();
  return ALLOWED_IMAGE_DOMAINS.some(
    (domain) =>
      normalizedHostname === domain ||
      normalizedHostname.endsWith(`.${domain}`)
  );
};

/**
 * Retorna a lista de domínios permitidos
 */
export const getAllowedDomains = (): string[] => {
  return [...ALLOWED_IMAGE_DOMAINS];
};

/**
 * Adiciona um domínio à whitelist em runtime (útil para configuração dinâmica)
 * @param domain - Domínio a adicionar
 */
export const addAllowedDomain = (domain: string): void => {
  const normalizedDomain = domain.toLowerCase().trim();
  if (!ALLOWED_IMAGE_DOMAINS.includes(normalizedDomain)) {
    ALLOWED_IMAGE_DOMAINS.push(normalizedDomain);
  }
};

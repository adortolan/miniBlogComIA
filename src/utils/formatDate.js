/**
 * Formata um timestamp do Firestore para string legível
 * @param {Object} timestamp - Timestamp do Firestore com propriedade seconds
 * @returns {string} - Data formatada
 */
export const formatDate = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return 'Data não disponível';
  }

  const date = new Date(timestamp.seconds * 1000);
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('pt-BR', options);
};

/**
 * Formata timestamp para formato relativo (ex: "há 2 dias")
 * @param {Object} timestamp - Timestamp do Firestore
 * @returns {string} - Data relativa
 */
export const formatRelativeDate = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return 'Data não disponível';
  }

  const date = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'agora há pouco';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `há ${diffInMonths} ${diffInMonths === 1 ? 'mês' : 'meses'}`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `há ${diffInYears} ${diffInYears === 1 ? 'ano' : 'anos'}`;
};

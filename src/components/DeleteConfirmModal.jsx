/**
 * Modal de confirmação para exclusão de post
 * @param {Object} props - Props do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar modal
 * @param {Function} props.onConfirm - Função para confirmar exclusão
 * @param {string} props.postTitle - Título do post a ser excluído
 * @param {boolean} props.loading - Estado de loading
 * @returns {JSX.Element|null}
 */
export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  loading = false,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        data-testid="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <svg
            className="w-8 h-8 text-red-600"
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
        </div>

        <h2
          id="modal-title"
          className="text-2xl font-bold text-gray-900 text-center mb-2"
        >
          Tem certeza?
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Você está prestes a excluir o post{' '}
          <strong className="text-gray-900">"{postTitle}"</strong>. Esta ação não
          pode ser desfeita.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={`flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
};

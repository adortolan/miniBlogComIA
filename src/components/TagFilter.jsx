/**
 * Componente de filtro por tags
 * @param {Object} props - Props do componente
 * @param {Array<string>} props.tags - Lista de tags disponíveis
 * @param {string|null} props.selectedTag - Tag atualmente selecionada
 * @param {Function} props.onTagSelect - Função chamada ao selecionar tag
 * @returns {JSX.Element}
 */
export const TagFilter = ({ tags, selectedTag, onTagSelect }) => {
  if (!tags || tags.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhuma tag disponível
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Filtrar por Tag
      </h3>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              selectedTag === tag
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            {tag}
          </button>
        ))}

        {selectedTag && (
          <button
            onClick={() => onTagSelect(null)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-medium text-sm hover:bg-gray-300 transition-colors"
          >
            ✕ Limpar Filtro
          </button>
        )}
      </div>
    </div>
  );
};

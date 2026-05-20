import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilter } from './TagFilter';

describe('TagFilter', () => {
  const mockTags = ['react', 'javascript', 'typescript', 'nodejs'];

  const defaultProps = {
    tags: mockTags,
    selectedTag: null,
    onTagSelect: vi.fn(),
  };

  it('deve renderizar todas as tags disponíveis', () => {
    render(<TagFilter {...defaultProps} />);

    mockTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('deve chamar onTagSelect ao clicar em uma tag', () => {
    render(<TagFilter {...defaultProps} />);

    const reactTag = screen.getByText('react');
    fireEvent.click(reactTag);

    expect(defaultProps.onTagSelect).toHaveBeenCalledWith('react');
  });

  it('deve destacar tag selecionada', () => {
    render(<TagFilter {...defaultProps} selectedTag="react" />);

    const reactTag = screen.getByText('react');
    expect(reactTag).toHaveClass('bg-blue-600');
  });

  it('deve renderizar botão de limpar filtro quando tag está selecionada', () => {
    render(<TagFilter {...defaultProps} selectedTag="react" />);

    expect(screen.getByText(/limpar filtro/i)).toBeInTheDocument();
  });

  it('não deve renderizar botão de limpar quando nenhuma tag está selecionada', () => {
    render(<TagFilter {...defaultProps} selectedTag={null} />);

    expect(screen.queryByText(/limpar filtro/i)).not.toBeInTheDocument();
  });

  it('deve chamar onTagSelect com null ao clicar em limpar filtro', () => {
    render(<TagFilter {...defaultProps} selectedTag="react" />);

    const clearButton = screen.getByText(/limpar filtro/i);
    fireEvent.click(clearButton);

    expect(defaultProps.onTagSelect).toHaveBeenCalledWith(null);
  });

  it('deve renderizar mensagem quando não há tags', () => {
    render(<TagFilter {...defaultProps} tags={[]} />);

    expect(screen.getByText(/nenhuma tag disponível/i)).toBeInTheDocument();
  });

  it('deve exibir título da seção', () => {
    render(<TagFilter {...defaultProps} />);

    expect(screen.getByText(/filtrar por tag/i)).toBeInTheDocument();
  });
});

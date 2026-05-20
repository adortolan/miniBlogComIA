import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    postTitle: 'Meu Post de Teste',
    loading: false,
  };

  it('deve renderizar modal quando isOpen é true', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/tem certeza/i)).toBeInTheDocument();
  });

  it('não deve renderizar modal quando isOpen é false', () => {
    render(<DeleteConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deve exibir título do post a ser excluído', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    expect(screen.getByText(/meu post de teste/i)).toBeInTheDocument();
  });

  it('deve chamar onConfirm ao clicar em confirmar', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /confirmar exclusão/i });
    fireEvent.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar em cancelar', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('deve desabilitar botões quando loading é true', () => {
    render(<DeleteConfirmModal {...defaultProps} loading={true} />);

    const confirmButton = screen.getByRole('button', { name: /excluindo/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('deve exibir texto de loading no botão de confirmar', () => {
    render(<DeleteConfirmModal {...defaultProps} loading={true} />);

    expect(screen.getByText(/excluindo/i)).toBeInTheDocument();
  });

  it('deve fechar modal ao clicar no overlay', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('não deve fechar modal ao clicar no conteúdo', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const content = screen.getByTestId('modal-content');
    fireEvent.click(content);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('deve ter estilo de alerta no botão de confirmar', () => {
    render(<DeleteConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByRole('button', { name: /confirmar exclusão/i });
    expect(confirmButton).toHaveClass('bg-red-600');
  });
});

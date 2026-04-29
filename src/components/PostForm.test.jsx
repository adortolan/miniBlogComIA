import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostForm } from './PostForm';

describe('PostForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    loading: false,
  };

  it('deve renderizar todos os campos do formulário', () => {
    render(<PostForm {...defaultProps} />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conteúdo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url da imagem/i)).toBeInTheDocument();
  });

  it('deve validar campos obrigatórios ao submeter', async () => {
    render(<PostForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /publicar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/conteúdo é obrigatório/i)).toBeInTheDocument();
    });

    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('deve chamar onSubmit com dados corretos', async () => {
    render(<PostForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Meu Post' },
    });
    fireEvent.change(screen.getByLabelText(/conteúdo/i), {
      target: { value: '# Conteúdo do post' },
    });
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: 'react, javascript' },
    });
    fireEvent.change(screen.getByLabelText(/url da imagem/i), {
      target: { value: 'https://example.com/image.jpg' },
    });

    const submitButton = screen.getByRole('button', { name: /publicar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        title: 'Meu Post',
        content: '# Conteúdo do post',
        tags: ['react', 'javascript'],
        imageURL: 'https://example.com/image.jpg',
      });
    });
  });

  it('deve exibir preview da imagem quando URL válida é inserida', async () => {
    render(<PostForm {...defaultProps} />);

    const imageInput = screen.getByLabelText(/url da imagem/i);
    fireEvent.change(imageInput, {
      target: { value: 'https://example.com/image.jpg' },
    });

    await waitFor(() => {
      const preview = screen.getByAltText(/preview/i);
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', 'https://example.com/image.jpg');
    });
  });

  it('deve validar formato de URL da imagem', async () => {
    render(<PostForm {...defaultProps} />);

    const imageInput = screen.getByLabelText(/url da imagem/i);
    fireEvent.change(imageInput, {
      target: { value: 'url-invalida' },
    });

    fireEvent.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(screen.getByText(/url inválida/i)).toBeInTheDocument();
    });
  });

  it('deve pré-preencher campos quando initialData é fornecido', () => {
    const initialData = {
      title: 'Post Existente',
      content: 'Conteúdo existente',
      tags: ['react', 'typescript'],
      imageURL: 'https://example.com/existing.jpg',
    };

    render(<PostForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByLabelText(/título/i)).toHaveValue('Post Existente');
    expect(screen.getByLabelText(/conteúdo/i)).toHaveValue('Conteúdo existente');
    expect(screen.getByLabelText(/tags/i)).toHaveValue('react, typescript');
    expect(screen.getByLabelText(/url da imagem/i)).toHaveValue(
      'https://example.com/existing.jpg'
    );
  });

  it('deve desabilitar botão de submit quando loading é true', () => {
    render(<PostForm {...defaultProps} loading={true} />);

    const submitButton = screen.getByRole('button', { name: /publicando/i });
    expect(submitButton).toBeDisabled();
  });

  it('deve processar tags corretamente (trim e lowercase)', async () => {
    render(<PostForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'Post' },
    });
    fireEvent.change(screen.getByLabelText(/conteúdo/i), {
      target: { value: 'Conteúdo' },
    });
    fireEvent.change(screen.getByLabelText(/tags/i), {
      target: { value: ' React , JavaScript , TypeScript ' },
    });

    fireEvent.click(screen.getByRole('button', { name: /publicar/i }));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['react', 'javascript', 'typescript'],
        })
      );
    });
  });
});

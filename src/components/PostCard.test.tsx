import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PostCard } from './PostCard';
import type { Post, FirebaseTimestamp } from '../types';

// Mock timestamp helper function
const createMockTimestamp = (seconds: number, nanoseconds: number): FirebaseTimestamp => ({
  seconds,
  nanoseconds,
  toDate: () => new Date(seconds * 1000 + nanoseconds / 1000000),
  toMillis: () => seconds * 1000 + nanoseconds / 1000000,
  isEqual: (other: unknown) => {
    const otherTimestamp = other as { seconds: number; nanoseconds: number };
    return seconds === otherTimestamp.seconds && nanoseconds === otherTimestamp.nanoseconds;
  },
  toJSON: () => ({ seconds, nanoseconds }),
  valueOf: () => ({ seconds, nanoseconds }),
} as unknown as FirebaseTimestamp);

describe('PostCard', () => {
  const mockPost: Post = {
    id: '1',
    slug: 'meu-post',
    title: 'Meu Post de Teste',
    content: '# Conteúdo do post\n\nEste é um post de exemplo com muito conteúdo para testar o trecho.',
    tags: ['react', 'javascript', 'typescript'],
    imageURL: 'https://example.com/image.jpg',
    authorId: 'user123',
    createdAt: createMockTimestamp(1672531200, 0),
    updatedAt: createMockTimestamp(1672531200, 0),
  };

  const renderPostCard = (post: Post = mockPost) => {
    return render(
      <BrowserRouter>
        <PostCard post={post} />
      </BrowserRouter>
    );
  };

  it('deve renderizar título do post', () => {
    renderPostCard();
    expect(screen.getByText('Meu Post de Teste')).toBeInTheDocument();
  });

  it('deve renderizar trecho do conteúdo', () => {
    renderPostCard();
    const excerpt = screen.getByText(/Conteúdo do post/i);
    expect(excerpt).toBeInTheDocument();
  });

  it('deve limitar o trecho a um número específico de caracteres', () => {
    const longContent = 'a'.repeat(500);
    const postWithLongContent: Post = { ...mockPost, content: longContent };
    renderPostCard(postWithLongContent);

    const excerpt = screen.getByTestId('post-excerpt');
    expect(excerpt.textContent?.length).toBeLessThanOrEqual(200);
  });

  it('deve renderizar todas as tags', () => {
    renderPostCard();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('deve renderizar imagem de capa quando URL fornecida', () => {
    renderPostCard();
    const image = screen.getByAltText('Meu Post de Teste');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('não deve renderizar imagem quando URL não fornecida', () => {
    const postWithoutImage: Post = { ...mockPost, imageURL: '' };
    renderPostCard(postWithoutImage);
    const image = screen.queryByAltText('Meu Post de Teste');
    expect(image).not.toBeInTheDocument();
  });

  it('deve renderizar data formatada', () => {
    renderPostCard();
    expect(screen.getByTestId('post-date')).toBeInTheDocument();
  });

  it('deve ter link para página de detalhes do post', () => {
    renderPostCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/posts/meu-post');
  });

  it('deve renderizar placeholder quando não há imagem', () => {
    const postWithoutImage: Post = { ...mockPost, imageURL: undefined };
    renderPostCard(postWithoutImage);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('deve aplicar classes Tailwind para estilização', () => {
    renderPostCard();
    const article = screen.getByRole('article');
    expect(article).toHaveClass('bg-dark-700');
  });
});

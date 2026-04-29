import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postService } from './postService';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn(() => ({ seconds: Date.now() / 1000 })),
}));

vi.mock('../config/firebase', () => ({
  db: {},
}));

import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

describe('postService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPost', () => {
    it('deve criar um post com todos os campos obrigatórios', async () => {
      const postData = {
        title: 'Meu Post',
        content: '# Conteúdo do post',
        slug: 'meu-post',
        tags: ['react', 'javascript'],
        imageURL: 'https://example.com/image.jpg',
        authorId: 'user123',
      };

      const mockCollectionRef = { name: 'posts' };
      collection.mockReturnValue(mockCollectionRef);
      addDoc.mockResolvedValue({ id: 'post123' });

      const result = await postService.createPost(postData);

      expect(collection).toHaveBeenCalledWith({}, 'posts');
      expect(addDoc).toHaveBeenCalledWith(
        mockCollectionRef,
        expect.objectContaining({
          ...postData,
          createdAt: expect.any(Object),
        })
      );
      expect(result.id).toBe('post123');
    });

    it('deve validar campos obrigatórios', async () => {
      const invalidPost = {
        content: 'Conteúdo sem título',
      };

      await expect(postService.createPost(invalidPost)).rejects.toThrow();
    });
  });

  describe('checkSlugUniqueness', () => {
    it('deve retornar true se slug não existir', async () => {
      const mockCollectionRef = { name: 'posts' };
      const mockQuery = { type: 'query' };
      
      collection.mockReturnValue(mockCollectionRef);
      where.mockReturnValue({ field: 'slug' });
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({ empty: true, docs: [] });

      const isUnique = await postService.checkSlugUniqueness('novo-slug');

      expect(isUnique).toBe(true);
      expect(where).toHaveBeenCalledWith('slug', '==', 'novo-slug');
    });

    it('deve retornar false se slug já existir', async () => {
      const mockCollectionRef = { name: 'posts' };
      const mockQuery = { type: 'query' };
      
      collection.mockReturnValue(mockCollectionRef);
      where.mockReturnValue({ field: 'slug' });
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({ empty: false, docs: [{ id: '1' }] });

      const isUnique = await postService.checkSlugUniqueness('slug-existente');

      expect(isUnique).toBe(false);
    });
  });

  describe('getAllPosts', () => {
    it('deve retornar lista de posts ordenados por data', async () => {
      const mockDocs = [
        { id: '1', data: () => ({ title: 'Post 1', createdAt: { seconds: 100 } }) },
        { id: '2', data: () => ({ title: 'Post 2', createdAt: { seconds: 200 } }) },
      ];
      
      const mockCollectionRef = { name: 'posts' };
      const mockQuery = { type: 'query' };
      
      collection.mockReturnValue(mockCollectionRef);
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({ docs: mockDocs });

      const posts = await postService.getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0]).toEqual({ id: '1', title: 'Post 1', createdAt: { seconds: 100 } });
    });
  });

  describe('getPostBySlug', () => {
    it('deve retornar post pelo slug', async () => {
      const mockDoc = {
        id: 'post123',
        data: () => ({ title: 'Meu Post', slug: 'meu-post' }),
      };
      
      const mockCollectionRef = { name: 'posts' };
      const mockQuery = { type: 'query' };
      
      collection.mockReturnValue(mockCollectionRef);
      where.mockReturnValue({ field: 'slug' });
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({ empty: false, docs: [mockDoc] });

      const post = await postService.getPostBySlug('meu-post');

      expect(post.id).toBe('post123');
      expect(post.slug).toBe('meu-post');
    });

    it('deve retornar null se post não for encontrado', async () => {
      const mockCollectionRef = { name: 'posts' };
      const mockQuery = { type: 'query' };
      
      collection.mockReturnValue(mockCollectionRef);
      where.mockReturnValue({ field: 'slug' });
      query.mockReturnValue(mockQuery);
      getDocs.mockResolvedValue({ empty: true, docs: [] });

      const post = await postService.getPostBySlug('slug-inexistente');

      expect(post).toBeNull();
    });
  });
});

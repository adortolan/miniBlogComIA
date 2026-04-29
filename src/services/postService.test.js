import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postService } from './postService';
import { db } from '../config/firebase';

vi.mock('../config/firebase', () => ({
  db: {
    collection: vi.fn(),
  },
}));

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

      const mockAdd = vi.fn().mockResolvedValue({ id: 'post123' });
      const mockCollection = vi.fn().mockReturnValue({ add: mockAdd });
      db.collection = mockCollection;

      const result = await postService.createPost(postData);

      expect(mockCollection).toHaveBeenCalledWith('posts');
      expect(mockAdd).toHaveBeenCalledWith(
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
      const mockGet = vi.fn().mockResolvedValue({ empty: true });
      const mockWhere = vi.fn().mockReturnValue({ get: mockGet });
      const mockCollection = vi.fn().mockReturnValue({ where: mockWhere });
      db.collection = mockCollection;

      const isUnique = await postService.checkSlugUniqueness('novo-slug');

      expect(isUnique).toBe(true);
      expect(mockWhere).toHaveBeenCalledWith('slug', '==', 'novo-slug');
    });

    it('deve retornar false se slug já existir', async () => {
      const mockGet = vi.fn().mockResolvedValue({ empty: false });
      const mockWhere = vi.fn().mockReturnValue({ get: mockGet });
      const mockCollection = vi.fn().mockReturnValue({ where: mockWhere });
      db.collection = mockCollection;

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
      const mockGet = vi.fn().mockResolvedValue({ docs: mockDocs });
      const mockOrderBy = vi.fn().mockReturnValue({ get: mockGet });
      const mockCollection = vi.fn().mockReturnValue({ orderBy: mockOrderBy });
      db.collection = mockCollection;

      const posts = await postService.getAllPosts();

      expect(posts).toHaveLength(2);
      expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
    });
  });

  describe('getPostBySlug', () => {
    it('deve retornar post pelo slug', async () => {
      const mockDoc = {
        id: 'post123',
        data: () => ({ title: 'Meu Post', slug: 'meu-post' }),
      };
      const mockGet = vi.fn().mockResolvedValue({ docs: [mockDoc] });
      const mockWhere = vi.fn().mockReturnValue({ get: mockGet });
      const mockCollection = vi.fn().mockReturnValue({ where: mockWhere });
      db.collection = mockCollection;

      const post = await postService.getPostBySlug('meu-post');

      expect(post.id).toBe('post123');
      expect(post.slug).toBe('meu-post');
    });

    it('deve retornar null se post não for encontrado', async () => {
      const mockGet = vi.fn().mockResolvedValue({ docs: [] });
      const mockWhere = vi.fn().mockReturnValue({ get: mockGet });
      const mockCollection = vi.fn().mockReturnValue({ where: mockWhere });
      db.collection = mockCollection;

      const post = await postService.getPostBySlug('slug-inexistente');

      expect(post).toBeNull();
    });
  });
});

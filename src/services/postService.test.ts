import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postService } from './postService';
import type { CreatePostDTO, UpdatePostDTO, FirebaseTimestamp } from '../types';

// Mock types for Firebase
interface MockDocumentSnapshot {
  id: string;
  data(): Record<string, unknown>;
}

interface MockQuerySnapshot {
  empty: boolean;
  docs: MockDocumentSnapshot[];
}

interface MockCollectionReference {
  name: string;
}

interface MockQuery {
  type: string;
}

vi.mock('firebase/firestore', () => ({
  collection: vi.fn((): MockCollectionReference => ({ name: 'posts' })),
  addDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn((): FirebaseTimestamp => ({ 
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0 
  })),
  onSnapshot: vi.fn(),
}));

vi.mock('../config/firebase', () => ({
  db: {},
}));

import { collection, addDoc, getDocs, query, where, onSnapshot } from 'firebase/firestore';

// Mock implementations
const mockCollection = collection as ReturnType<typeof vi.fn>;
const mockAddDoc = addDoc as ReturnType<typeof vi.fn>;
const mockGetDocs = getDocs as ReturnType<typeof vi.fn>;
const mockQuery = query as ReturnType<typeof vi.fn>;
const mockWhere = where as ReturnType<typeof vi.fn>;
const mockOnSnapshot = onSnapshot as ReturnType<typeof vi.fn>;

describe('postService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPost', () => {
    it('deve criar um post com todos os campos obrigatórios', async () => {
      const postData: CreatePostDTO & { authorId: string; slug: string } = {
        title: 'Meu Post',
        content: '# Conteúdo do post',
        slug: 'meu-post',
        tags: ['react', 'javascript'],
        imageURL: 'https://example.com/image.jpg',
        authorId: 'user123',
      };

      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      mockCollection.mockReturnValue(mockCollectionRef);
      mockAddDoc.mockResolvedValue({ id: 'post123' });

      const result = await postService.createPost(postData);

      expect(mockCollection).toHaveBeenCalledWith({}, 'posts');
      expect(mockAddDoc).toHaveBeenCalledWith(
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
      } as CreatePostDTO & { authorId: string; slug: string };

      await expect(postService.createPost(invalidPost)).rejects.toThrow();
    });

    it('deve lançar erro de permissão negada', async () => {
      const postData: CreatePostDTO & { authorId: string; slug: string } = {
        title: 'Meu Post',
        content: '# Conteúdo do post',
        slug: 'meu-post',
        tags: ['react'],
        authorId: 'user123',
      };

      const mockError = new Error('permission-denied') as Error & { code: string };
      mockError.code = 'permission-denied';
      
      mockCollection.mockReturnValue({ name: 'posts' });
      mockAddDoc.mockRejectedValue(mockError);

      await expect(postService.createPost(postData)).rejects.toThrow(
        'Você não tem permissão para criar posts. Verifique se está autenticado.'
      );
    });
  });

  describe('checkSlugUniqueness', () => {
    it('deve retornar true se slug não existir', async () => {
      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      const mockQueryResult: MockQuery = { type: 'query' };
      
      mockCollection.mockReturnValue(mockCollectionRef);
      mockWhere.mockReturnValue({ field: 'slug' });
      mockQuery.mockReturnValue(mockQueryResult);
      mockGetDocs.mockResolvedValue({ empty: true, docs: [] } as MockQuerySnapshot);

      const isUnique = await postService.checkSlugUniqueness('novo-slug');

      expect(isUnique).toBe(true);
      expect(mockWhere).toHaveBeenCalledWith('slug', '==', 'novo-slug');
    });

    it('deve retornar false se slug já existir', async () => {
      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      const mockQueryResult: MockQuery = { type: 'query' };
      
      mockCollection.mockReturnValue(mockCollectionRef);
      mockWhere.mockReturnValue({ field: 'slug' });
      mockQuery.mockReturnValue(mockQueryResult);
      mockGetDocs.mockResolvedValue({ 
        empty: false, 
        docs: [{ id: '1', data: () => ({ slug: 'existente' }) }] 
      } as MockQuerySnapshot);

      const isUnique = await postService.checkSlugUniqueness('slug-existente');

      expect(isUnique).toBe(false);
    });

    it('deve excluir ID específico da verificação', async () => {
      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      const mockQueryResult: MockQuery = { type: 'query' };
      
      mockCollection.mockReturnValue(mockCollectionRef);
      mockWhere.mockReturnValue({ field: 'slug' });
      mockQuery.mockReturnValue(mockQueryResult);
      mockGetDocs.mockResolvedValue({ 
        empty: false, 
        docs: [
          { id: '1', data: () => ({ slug: 'meu-post' }) },
          { id: '2', data: () => ({ slug: 'meu-post' }) }
        ] 
      } as MockQuerySnapshot);

      const isUnique = await postService.checkSlugUniqueness('meu-post', '1');

      expect(isUnique).toBe(false); // Corrigido: ainda existe outro post com o mesmo slug
    });
  });

  describe('getAllPosts', () => {
    it('deve retornar lista de posts ordenados por data', async () => {
      const mockDocs: MockDocumentSnapshot[] = [
        { 
          id: '1', 
          data: () => ({ 
            title: 'Post 1', 
            createdAt: { seconds: 100, nanoseconds: 0 },
            updatedAt: { seconds: 100, nanoseconds: 0 }
          }) 
        },
        { 
          id: '2', 
          data: () => ({ 
            title: 'Post 2', 
            createdAt: { seconds: 200, nanoseconds: 0 },
            updatedAt: { seconds: 200, nanoseconds: 0 }
          }) 
        },
      ];
      
      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      const mockQueryResult: MockQuery = { type: 'query' };
      
      mockCollection.mockReturnValue(mockCollectionRef);
      mockQuery.mockReturnValue(mockQueryResult);
      mockGetDocs.mockResolvedValue({ docs: mockDocs } as MockQuerySnapshot);

      const posts = await postService.getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0]).toEqual({ 
        id: '1', 
        title: 'Post 1', 
        createdAt: { seconds: 100, nanoseconds: 0 },
        updatedAt: { seconds: 100, nanoseconds: 0 }
      });
    });
  });

  describe('getPostBySlug', () => {
    it('deve retornar post pelo slug', async () => {
      const mockDoc: MockDocumentSnapshot = {
        id: 'post123',
        data: () => ({ 
          title: 'Meu Post', 
          slug: 'meu-post',
          createdAt: { seconds: 100, nanoseconds: 0 },
          updatedAt: { seconds: 100, nanoseconds: 0 }
        }),
      };
      
      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      const mockQueryResult: MockQuery = { type: 'query' };
      
      mockCollection.mockReturnValue(mockCollectionRef);
      mockWhere.mockReturnValue({ field: 'slug' });
      mockQuery.mockReturnValue(mockQueryResult);
      mockGetDocs.mockResolvedValue({ empty: false, docs: [mockDoc] } as MockQuerySnapshot);

      const post = await postService.getPostBySlug('meu-post');

      expect(post?.id).toBe('post123');
      expect(post?.slug).toBe('meu-post');
    });

    it('deve retornar null se post não for encontrado', async () => {
      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      const mockQueryResult: MockQuery = { type: 'query' };
      
      mockCollection.mockReturnValue(mockCollectionRef);
      mockWhere.mockReturnValue({ field: 'slug' });
      mockQuery.mockReturnValue(mockQueryResult);
      mockGetDocs.mockResolvedValue({ empty: true, docs: [] } as MockQuerySnapshot);

      const post = await postService.getPostBySlug('slug-inexistente');

      expect(post).toBeNull();
    });
  });

  describe('getPostById', () => {
    it('deve retornar post pelo ID', async () => {
      const mockDocData: MockDocumentSnapshot = {
        id: 'post123',
        data: () => ({ 
          title: 'Meu Post', 
          slug: 'meu-post',
          createdAt: { seconds: 100, nanoseconds: 0 },
          updatedAt: { seconds: 100, nanoseconds: 0 }
        }),
      };
      
      const { getDoc, doc } = await import('firebase/firestore');
      const mockGetDoc = getDoc as ReturnType<typeof vi.fn>;
      const mockDocRef = doc as ReturnType<typeof vi.fn>;
      
      mockDocRef.mockReturnValue({ path: 'posts/post123' });
      mockGetDoc.mockResolvedValue({ 
        exists: () => true, 
        id: 'post123',
        data: () => mockDocData.data()
      } as unknown as Promise<{ exists: () => boolean; id: string; data: () => Record<string, unknown> }>);

      const post = await postService.getPostById('post123');

      expect(post?.id).toBe('post123');
      expect(post?.title).toBe('Meu Post');
    });

    it('deve retornar null se documento não existir', async () => {
      const { getDoc, doc } = await import('firebase/firestore');
      const mockGetDoc = getDoc as ReturnType<typeof vi.fn>;
      const mockDocRef = doc as ReturnType<typeof vi.fn>;
      
      mockDocRef.mockReturnValue({ path: 'posts/inexistente' });
      mockGetDoc.mockResolvedValue({ exists: () => false } as unknown as Promise<{ exists: () => boolean }>);

      const post = await postService.getPostById('inexistente');

      expect(post).toBeNull();
    });
  });

  describe('updatePost', () => {
    it('deve atualizar um post', async () => {
      const { updateDoc, doc } = await import('firebase/firestore');
      const mockUpdateDoc = updateDoc as ReturnType<typeof vi.fn>;
      const mockDocRef = doc as ReturnType<typeof vi.fn>;
      
      mockDocRef.mockReturnValue({ path: 'posts/post123' });
      mockUpdateDoc.mockResolvedValue(undefined);

      const updateData: UpdatePostDTO = {
        title: 'Título atualizado',
        content: 'Conteúdo atualizado'
      };

      await expect(postService.updatePost('post123', updateData)).resolves.not.toThrow();
      
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        { path: 'posts/post123' },
        expect.objectContaining({
          ...updateData,
          updatedAt: expect.any(Object)
        })
      );
    });
  });

  describe('deletePost', () => {
    it('deve excluir um post', async () => {
      const { deleteDoc, doc } = await import('firebase/firestore');
      const mockDeleteDoc = deleteDoc as ReturnType<typeof vi.fn>;
      const mockDocRef = doc as ReturnType<typeof vi.fn>;
      
      mockDocRef.mockReturnValue({ path: 'posts/post123' });
      mockDeleteDoc.mockResolvedValue(undefined);

      await expect(postService.deletePost('post123')).resolves.not.toThrow();
      
      expect(mockDeleteDoc).toHaveBeenCalledWith({ path: 'posts/post123' });
    });
  });

  describe('getPostsByTag', () => {
    it('deve retornar posts por tag', async () => {
      const mockDocs: MockDocumentSnapshot[] = [
        { 
          id: '1', 
          data: () => ({ 
            title: 'Post React', 
            tags: ['react', 'javascript'],
            createdAt: { seconds: 100, nanoseconds: 0 },
            updatedAt: { seconds: 100, nanoseconds: 0 }
          }) 
        },
      ];
      
      const mockCollectionRef: MockCollectionReference = { name: 'posts' };
      const mockQueryResult: MockQuery = { type: 'query' };
      
      mockCollection.mockReturnValue(mockCollectionRef);
      mockWhere.mockReturnValue({ field: 'tags' });
      mockQuery.mockReturnValue(mockQueryResult);
      mockGetDocs.mockResolvedValue({ docs: mockDocs } as MockQuerySnapshot);

      const posts = await postService.getPostsByTag('react');

      expect(posts).toHaveLength(1);
      expect(posts[0].tags).toContain('react');
    });
  });

  describe('subscribeToPostsRealtime', () => {
    it('deve configurar subscription em tempo real', () => {
      const mockUnsubscribe = vi.fn();
      mockOnSnapshot.mockReturnValue(mockUnsubscribe);

      const callback = vi.fn();
      const errorCallback = vi.fn();

      const unsubscribe = postService.subscribeToPostsRealtime(callback, errorCallback);

      expect(typeof unsubscribe).toBe('function');
      expect(mockOnSnapshot).toHaveBeenCalled();
    });

    it('deve chamar callback com posts quando há atualizações', () => {
      const mockUnsubscribe = vi.fn();
      mockOnSnapshot.mockImplementation((query, onNext) => {
        // Simular recebimento de dados
        onNext({
          docs: [
            {
              id: '1',
              data: () => ({
                title: 'Post 1',
                createdAt: { seconds: 100, nanoseconds: 0 },
                updatedAt: { seconds: 100, nanoseconds: 0 }
              })
            }
          ]
        });
        return mockUnsubscribe;
      });

      const callback = vi.fn();

      postService.subscribeToPostsRealtime(callback);

      expect(callback).toHaveBeenCalledWith([
        expect.objectContaining({
          id: '1',
          title: 'Post 1'
        })
      ]);
    });

    it('deve chamar errorCallback quando há erro de permissão', () => {
      const mockUnsubscribe = vi.fn();
      mockOnSnapshot.mockImplementation((query, onNext, onError) => {
        const error = new Error('permission-denied') as Error & { code: string };
        error.code = 'permission-denied';
        onError(error);
        return mockUnsubscribe;
      });

      const errorCallback = vi.fn();

      postService.subscribeToPostsRealtime(vi.fn(), errorCallback);

      expect(errorCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Você não tem permissão para acessar os posts. Verifique se está autenticado.'
        })
      );
    });
  });
});

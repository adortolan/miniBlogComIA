import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { logger } from '../utils/logger';
import type {
  Post,
  CreatePostDTO,
  UpdatePostDTO,
  PostService,
} from '../types';

const POSTS_COLLECTION = 'posts';

/**
 * Serviço para gerenciar posts no Firestore
 */
export const postService: PostService = {
  /**
   * Cria um novo post no Firestore
   */
  async createPost(postData: CreatePostDTO & { authorId: string; slug: string }): Promise<Omit<Post, 'createdAt' | 'updatedAt'>> {
    if (!postData.title || !postData.content || !postData.slug || !postData.authorId) {
      throw new Error('Campos obrigatórios ausentes: title, content, slug, authorId');
    }

    const postToCreate = {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), postToCreate);

      return {
        id: docRef.id,
        ...postData,
      };
    } catch (error: unknown) {
      logger.error('Erro ao criar post:', error);
      
      // Type guard para Firebase errors
      if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        const firebaseError = error as { code?: string; message?: string };
        logger.error('Error code:', firebaseError.code);
        logger.error('Error message:', firebaseError.message);

        if (firebaseError.code === 'permission-denied') {
          throw new Error('Você não tem permissão para criar posts. Verifique se está autenticado.');
        }

        if (firebaseError.code === 'unavailable' || firebaseError.message?.includes('CORS') || firebaseError.message?.includes('fetch')) {
          throw new Error('Erro de conexão com o Firebase. Verifique suas variáveis de ambiente (.env) e a configuração do Firebase. Erro: ' + (firebaseError.message || 'Unknown error'));
        }
      }

      throw error;
    }
  },

  /**
   * Verifica se um slug já existe no Firestore
   */
  async checkSlugUniqueness(slug: string, excludeId?: string | null): Promise<boolean> {
    const q = query(collection(db, POSTS_COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (excludeId) {
      return querySnapshot.docs.filter((doc) => doc.id !== excludeId).length === 0;
    }

    return querySnapshot.empty;
  },

  /**
   * Busca todos os posts ordenados por data de criação
   */
  async getAllPosts(): Promise<Post[]> {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  },

  /**
   * Inscreve-se para atualizações em tempo real dos posts
   */
  subscribeToPostsRealtime(
    callback: (posts: Post[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void {
    try {
      const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));

      return onSnapshot(
        q,
        (snapshot) => {
          const posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Post[];
          callback(posts);
        },
        (error: unknown) => {
          logger.error('Erro na subscription de posts:', error);
          
          // Type guard para Firebase errors
          if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
            const firebaseError = error as { code?: string; message?: string };
            logger.error('Error code:', firebaseError.code);
            logger.error('Error message:', firebaseError.message);

            // Handle various Firebase/CORS errors
            if (firebaseError.code === 'permission-denied') {
              const permissionError = new Error('Você não tem permissão para acessar os posts. Verifique se está autenticado.');
              if (errorCallback) {
                errorCallback(permissionError);
              }
              return;
            }

            if (firebaseError.code === 'unavailable' || firebaseError.message?.includes('CORS') || firebaseError.message?.includes('fetch')) {
              const corsError = new Error('Erro de conexão com o Firebase. Verifique suas variáveis de ambiente (.env) e a configuração do Firebase. Erro: ' + (firebaseError.message || 'Unknown error'));
              if (errorCallback) {
                errorCallback(corsError);
              }
              return;
            }
          }

          if (errorCallback) {
            errorCallback(error as Error);
          }
        }
      );
    } catch (error: unknown) {
      logger.error('Erro ao configurar subscription de posts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const initError = new Error('Erro ao inicializar conexão com o Firebase: ' + errorMessage);
      if (errorCallback) {
        errorCallback(initError);
      }
      return () => {}; // Return noop unsubscribe function
    }
  },

  /**
   * Busca um post pelo slug
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    const q = query(collection(db, POSTS_COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docData = querySnapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data(),
    } as Post;
  },

  /**
   * Busca um post pelo ID
   */
  async getPostById(id: string): Promise<Post | null> {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Post;
  },

  /**
   * Atualiza um post existente
   */
  async updatePost(id: string, postData: UpdatePostDTO): Promise<void> {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Exclui um post
   */
  async deletePost(id: string): Promise<void> {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  /**
   * Busca posts por tag
   */
  async getPostsByTag(tag: string): Promise<Post[]> {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  },
};

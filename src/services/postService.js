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

const POSTS_COLLECTION = 'posts';

/**
 * Serviço para gerenciar posts no Firestore
 */
export const postService = {
  /**
   * Cria um novo post no Firestore
   * @param {Object} postData - Dados do post
   * @returns {Promise<Object>} - Post criado com ID
   */
  async createPost(postData) {
    if (!postData.title || !postData.content || !postData.slug || !postData.authorId) {
      throw new Error('Campos obrigatórios ausentes: title, content, slug, authorId');
    }

    const postToCreate = {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, POSTS_COLLECTION), postToCreate);

    return {
      id: docRef.id,
      ...postData,
    };
  },

  /**
   * Verifica se um slug já existe no Firestore
   * @param {string} slug - Slug a verificar
   * @param {string} excludeId - ID do post a excluir da verificação (para edição)
   * @returns {Promise<boolean>} - true se único, false se já existe
   */
  async checkSlugUniqueness(slug, excludeId = null) {
    const q = query(collection(db, POSTS_COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (excludeId) {
      return querySnapshot.docs.filter((doc) => doc.id !== excludeId).length === 0;
    }

    return querySnapshot.empty;
  },

  /**
   * Busca todos os posts ordenados por data de criação
   * @returns {Promise<Array>} - Lista de posts
   */
  async getAllPosts() {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  /**
   * Inscreve-se para atualizações em tempo real dos posts
   * @param {Function} callback - Função chamada quando há atualizações
   * @param {Function} errorCallback - Função chamada quando há erro (opcional)
   * @returns {Function} - Função para cancelar inscrição
   */
  subscribeToPostsRealtime(callback, errorCallback = null) {
    const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(posts);
      },
      (error) => {
        console.error('Erro na subscription de posts:', error);
        if (errorCallback) {
          errorCallback(error);
        }
      }
    );
  },

  /**
   * Busca um post pelo slug
   * @param {string} slug - Slug do post
   * @returns {Promise<Object|null>} - Post encontrado ou null
   */
  async getPostBySlug(slug) {
    const q = query(collection(db, POSTS_COLLECTION), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docData = querySnapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data(),
    };
  },

  /**
   * Busca um post pelo ID
   * @param {string} id - ID do post
   * @returns {Promise<Object|null>} - Post encontrado ou null
   */
  async getPostById(id) {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  },

  /**
   * Atualiza um post existente
   * @param {string} id - ID do post
   * @param {Object} postData - Dados atualizados
   * @returns {Promise<void>}
   */
  async updatePost(id, postData) {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...postData,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Exclui um post
   * @param {string} id - ID do post
   * @returns {Promise<void>}
   */
  async deletePost(id) {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  /**
   * Busca posts por tag
   * @param {string} tag - Tag para filtrar
   * @returns {Promise<Array>} - Lista de posts com a tag
   */
  async getPostsByTag(tag) {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },
};

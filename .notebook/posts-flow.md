# 003 - Fluxo de Posts (CRUD)

**Tags:** posts, firestore, hooks  
**Criado:** 2026-05-22

## Visão Geral

Posts são armazenados na collection `posts` do Firestore. O CRUD é encapsulado em:
- `src/services/postService.ts` → acesso direto ao Firestore
- `src/hooks/use*.ts` → hooks React que expõem loading/error/data

## Criação de Post

```
CreatePost page → useCreatePost hook
  1. Validação: title + content obrigatórios, user autenticado
  2. Gera slug via generateSlug(title)
  3. Verifica unicidade do slug (loop até 100 tentativas com sufixo -N)
  4. postService.createPost({ ...data, slug, authorId: user.uid })
  5. Firestore adiciona serverTimestamp() para createdAt/updatedAt
```

**Gotcha:** O slug é gerado a partir do título com normalização NFD (remove acentos), lowercase, remove caracteres especiais.

## Listagem de Posts

Dois modos disponíveis em `usePosts`:
- **One-shot** (`realtime: false`): `postService.getAllPosts()` → query `orderBy('createdAt', 'desc')`
- **Realtime** (`realtime: true`): `postService.subscribeToPostsRealtime()` → `onSnapshot`

A Home usa `realtime: true` para atualizações automáticas.

## Filtro por Tag

```
Home page → usePostsByTag(tag)
  1. Se tag é null → retorna []
  2. postService.getPostsByTag(tag)
  3. Query: where('tags', 'array-contains', tag) + orderBy('createdAt', 'desc')
```

Tags são passadas via URL search param: `/?tag=react`

## Detalhes do Post

```
PostDetail page
  1. Obtém slug via useParams()
  2. postService.getPostBySlug(slug) → query where('slug', '==', slug)
  3. Renderiza conteúdo com ReactMarkdown
  4. Exibe ações (editar/excluir) se user é autor OU admin
```

## Atualização de Post

```
EditPost page → useUpdatePost hook
  1. Validação: postId, title, content obrigatórios
  2. Re-gera slug se título mudou (compara com oldSlug)
  3. Verifica unicidade excluindo o próprio post (checkSlugUniqueness com excludeId)
  4. postService.updatePost(id, data) → updateDoc com serverTimestamp()
```

## Exclusão de Post

```
PostDetail page → useDeletePost hook + DeleteConfirmModal
  1. Abre modal de confirmação
  2. Se confirmado: postService.deletePost(id) → deleteDoc
  3. Navega para "/"
```

## Permissões de CRUD

| Ação | Quem pode |
|------|-----------|
| Ler posts | Qualquer pessoa (público) |
| Criar post | Usuário autenticado |
| Editar post | Autor do post OU admin |
| Excluir post | Autor do post OU admin |

Regras duplicadas em: lógica do frontend (canEditOrDelete) E `firestore.rules`.

## PostService Interface

```typescript
interface PostService {
  createPost(data): Promise<Omit<Post, 'createdAt' | 'updatedAt'>>;
  getAllPosts(): Promise<Post[]>;
  getPostById(id): Promise<Post | null>;
  getPostBySlug(slug): Promise<Post | null>;
  updatePost(id, data): Promise<void>;
  deletePost(id): Promise<void>;
  getPostsByTag(tag): Promise<Post[]>;
  checkSlugUniqueness(slug, excludeId?): Promise<boolean>;
  subscribeToPostsRealtime(callback, errorCallback?): () => void;
}
```

## Referências

- `src/services/postService.ts`: Implementação completa
- `src/hooks/useCreatePost.ts`: Hook de criação
- `src/hooks/useUpdatePost.ts`: Hook de atualização
- `src/hooks/useDeletePost.ts`: Hook de exclusão
- `src/hooks/usePosts.ts`: Hook de listagem
- `src/hooks/usePostsByTag.ts`: Hook de filtro por tag
- `src/utils/generateSlug.ts`: Gerador de slug
- `src/components/PostForm.tsx`: Formulário reutilizável

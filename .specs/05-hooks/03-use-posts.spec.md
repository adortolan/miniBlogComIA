# 5.3 usePosts

## Descrição
Criar hook customizado específico para operações com posts, construído sobre `useFirestore` e `postService`.

## Dependências
- 5.2 useFirestore
- 7.1 postService

## Etapas

### Etapa 1 — Criar hook usePosts
- Criar `src/hooks/usePosts.js`
- Internamente usa `useFirestore('posts')` ou chama `postService`

### Etapa 2 — Implementar createPost
- `createPost(data)`: cria novo post
- Gerar slug, adicionar `authorId` e `createdAt`
- Retornar ID/slug do post criado

### Etapa 3 — Implementar getPosts
- `getPosts()`: retorna todos os posts ordenados por data
- Suporte a listener em tempo real
- Estado: `posts`, `loading`, `error`

### Etapa 4 — Implementar getPost
- `getPost(slug)`: retorna um post específico por slug
- Estado: `post`, `loading`, `error`

### Etapa 5 — Implementar updatePost
- `updatePost(id, data)`: atualiza post existente
- Regenerar slug se título mudar

### Etapa 6 — Implementar deletePost
- `deletePost(id)`: remove post do Firestore

### Etapa 7 — Implementar filtro por tag
- `getPostsByTag(tag)`: filtra posts que contêm a tag
- Retornar lista filtrada

### Etapa 8 — Retornar interface do hook
- Retornar: `{ posts, post, createPost, getPost, getPosts, updatePost, deletePost, getPostsByTag, loading, error }`

## Critérios de Aceite
- [ ] Todos os métodos CRUD funcionam corretamente
- [ ] Posts são retornados ordenados por data
- [ ] Filtro por tag funciona
- [ ] Estados `loading` e `error` são gerenciados
- [ ] Listener em tempo real atualiza a lista automaticamente

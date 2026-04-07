# 7.1 postService

## Descrição
Implementar camada de serviço para todas as operações de posts no Firestore.

## Dependências
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Criar arquivo de serviço
- Criar `src/services/postService.js`
- Importar `db` de `src/config/firebase.js`
- Importar métodos do Firestore: `collection`, `doc`, `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`, `query`, `where`, `orderBy`, `onSnapshot`, `serverTimestamp`

### Etapa 2 — createPost(data)
- Adicionar documento à coleção `posts`
- Dados: `{ title, content, slug, tags, imageURL, authorId, createdAt: serverTimestamp() }`
- Retornar ID do documento criado

### Etapa 3 — getPostBySlug(slug)
- Query: `where('slug', '==', slug)` na coleção `posts`
- Retornar primeiro documento encontrado ou `null`
- Incluir `id` do documento no objeto retornado

### Etapa 4 — getAllPosts()
- Query: `orderBy('createdAt', 'desc')` na coleção `posts`
- Retornar array de posts com seus `id`s

### Etapa 5 — getPostsByTag(tag)
- Query: `where('tags', 'array-contains', tag)` + `orderBy('createdAt', 'desc')`
- Retornar array de posts filtrados

### Etapa 6 — updatePost(id, data)
- Atualizar documento com `updateDoc(doc(db, 'posts', id), data)`
- Adicionar `updatedAt: serverTimestamp()`

### Etapa 7 — deletePost(id)
- Remover documento com `deleteDoc(doc(db, 'posts', id))`

### Etapa 8 — subscribeToPostsRealtime(callback)
- Criar listener com `onSnapshot` na coleção `posts`
- Ordenar por `createdAt` descendente
- Chamar `callback` com array atualizado de posts
- Retornar função de `unsubscribe`

## Critérios de Aceite
- [ ] `createPost` cria documento com todos os campos + `createdAt`
- [ ] `getPostBySlug` retorna post correto ou `null`
- [ ] `getAllPosts` retorna posts ordenados por data
- [ ] `getPostsByTag` filtra corretamente por tag
- [ ] `updatePost` atualiza campos sem perder dados existentes
- [ ] `deletePost` remove documento do Firestore
- [ ] `subscribeToPostsRealtime` atualiza em tempo real via callback

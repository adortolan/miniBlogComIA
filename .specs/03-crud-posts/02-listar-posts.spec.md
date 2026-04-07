# 3.2 Listar Posts (Read - List)

## Descrição
Implementar a listagem de todos os posts na página Home com atualização em tempo real.

## Dependências
- 4.3 PostCard
- 7.1 postService
- 5.3 usePosts

## Etapas

### Etapa 1 — Criar página Home
- Criar `src/pages/Home.jsx`
- Rota: `/`
- Acesso público (não requer autenticação)

### Etapa 2 — Buscar posts do Firestore
- Usar hook `usePosts` ou `postService.getAllPosts()`
- Ordenar por `createdAt` descendente (mais recente primeiro)
- Implementar listener em tempo real com `onSnapshot` via `subscribeToPostsRealtime()`

### Etapa 3 — Renderizar lista de posts
- Mapear array de posts para componentes `PostCard`
- Cada `PostCard` exibe: título, trecho do conteúdo, tags, autor e data
- Link em cada card para `/posts/:slug`

### Etapa 4 — Estados da página
- **Loading**: exibir skeleton/spinner enquanto carrega
- **Vazio**: exibir mensagem "Nenhum post encontrado" quando não houver posts
- **Erro**: exibir mensagem de erro caso a query falhe

### Etapa 5 — Configurar rota
- Adicionar rota `/` apontando para `Home`

## Critérios de Aceite
- [ ] Home exibe lista de posts ordenados por data (mais recente primeiro)
- [ ] Posts são atualizados em tempo real (sem refresh manual)
- [ ] Cada post exibe título, trecho, tags, autor e data
- [ ] Clicar no card redireciona para a página de detalhe
- [ ] Estados de loading, vazio e erro são tratados
- [ ] Página é acessível sem autenticação

# 3.6 Buscar Posts por Tag

## Descrição
Implementar filtro de posts por tag na página Home.

## Dependências
- 3.2 Listar Posts
- 7.1 postService

## Etapas

### Etapa 1 — Implementar query por tag
- Criar método `postService.getPostsByTag(tag)`
- Usar query Firestore: `where('tags', 'array-contains', tag)`
- Manter ordenação por `createdAt` descendente

### Etapa 2 — Adicionar filtro na Home
- Exibir lista de tags disponíveis (extraídas dos posts ou pré-definidas)
- Ao clicar em uma tag:
  - Filtrar posts exibidos pela tag selecionada
  - Atualizar URL com query param (ex: `/?tag=react`)
- Botão "Limpar filtro" para voltar à listagem completa

### Etapa 3 — Tags clicáveis no PostCard e PostDetail
- Cada tag exibida no `PostCard` e `PostDetail` é clicável
- Ao clicar, redireciona para Home com filtro aplicado

### Etapa 4 — Estado do filtro
- Usar `useSearchParams` do React Router para ler/escrever a tag da URL
- Manter filtro ativo ao navegar (via query params)

## Critérios de Aceite
- [ ] Posts são filtrados corretamente por tag
- [ ] Tags clicáveis no PostCard e PostDetail redirecionam para Home filtrada
- [ ] URL reflete o filtro ativo (ex: `/?tag=react`)
- [ ] Botão de limpar filtro remove a filtragem
- [ ] Lista de tags disponíveis é exibida na Home
- [ ] Filtro funciona com atualização em tempo real

# 3.3 Visualizar Post (Read - Detail)

## Descrição
Implementar a página de detalhe de um post individual com renderização de Markdown.

## Dependências
- 7.1 postService
- Biblioteca `react-markdown`

## Etapas

### Etapa 1 — Criar página PostDetail
- Criar `src/pages/PostDetail.jsx`
- Rota: `/posts/:slug`
- Acesso público

### Etapa 2 — Buscar post por slug
- Extrair `slug` dos parâmetros da URL via `useParams()`
- Chamar `postService.getPostBySlug(slug)`
- Tratar caso de post não encontrado (exibir página 404)

### Etapa 3 — Renderizar conteúdo do post
- Exibir:
  - Título (`<h1>`)
  - Imagem de capa (se existir)
  - Conteúdo em Markdown renderizado com `react-markdown`
  - Nome do autor
  - Data de criação (formatada)
  - Tags como badges/chips clicáveis

### Etapa 4 — Ações do autor/admin
- Se o usuário logado for o autor do post ou admin:
  - Exibir botão "Editar" → redireciona para `/admin/posts/edit/:id`
  - Exibir botão "Excluir" → abre diálogo de confirmação (feature 3.5)
- Se não for autor/admin: botões não aparecem

### Etapa 5 — Configurar rota
- Adicionar rota `/posts/:slug` apontando para `PostDetail`

## Critérios de Aceite
- [ ] Página exibe post completo com título, conteúdo Markdown, autor, data e tags
- [ ] Conteúdo Markdown é renderizado corretamente (headings, listas, código, links)
- [ ] Imagem de capa é exibida quando presente
- [ ] Botões de editar/excluir aparecem apenas para o autor ou admin
- [ ] Post não encontrado exibe mensagem de erro ou página 404
- [ ] Tags são clicáveis e filtram posts na Home

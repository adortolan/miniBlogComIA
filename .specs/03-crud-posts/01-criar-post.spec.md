# 3.1 Criar Post (Create)

## Descrição
Implementar a funcionalidade de criação de novos posts com formulário completo, upload de imagem e geração automática de slug.

## Dependências
- 2.5 Proteção de Rotas
- 4.4 PostForm
- 7.1 postService
- 7.3 storageService

## Etapas

### Etapa 1 — Criar página CreatePost
- Criar `src/pages/CreatePost.jsx`
- Rota: `/admin/posts/new`
- Acessível apenas por usuários autenticados

### Etapa 2 — Implementar formulário de criação
- Utilizar componente `PostForm` reutilizável
- Campos:
  - `title` (input text, obrigatório)
  - `content` (textarea para Markdown, obrigatório)
  - `tags` (input com suporte a múltiplas tags)
  - Imagem de capa (input file)

### Etapa 3 — Gerar slug automaticamente
- Criar função utilitária `generateSlug(title)`
- Converter título para lowercase
- Remover acentos e caracteres especiais
- Substituir espaços por hífens
- Verificar unicidade do slug no Firestore

### Etapa 4 — Upload de imagem de capa
- Ao selecionar imagem, fazer upload via `storageService.uploadImage()`
- Salvar URL retornada no campo `imageURL` do post
- Exibir preview da imagem antes de salvar

### Etapa 5 — Salvar post no Firestore
- Montar objeto do post:
  - `title`, `content`, `slug`, `tags`, `imageURL`
  - `authorId`: `user.uid` do AuthContext
  - `createdAt`: `serverTimestamp()` do Firestore
- Chamar `postService.createPost(data)`

### Etapa 6 — Feedback e redirecionamento
- Exibir loading durante salvamento
- Em caso de sucesso: redirecionar para `/posts/:slug`
- Em caso de erro: exibir mensagem de erro

## Critérios de Aceite
- [ ] Formulário valida campos obrigatórios (title, content)
- [ ] Slug é gerado automaticamente a partir do título
- [ ] Imagem de capa é enviada ao Firebase Storage
- [ ] Post é salvo no Firestore com todos os campos corretos
- [ ] `authorId` e `createdAt` são preenchidos automaticamente
- [ ] Após criação, usuário é redirecionado para o post
- [ ] Apenas usuários autenticados acessam a página

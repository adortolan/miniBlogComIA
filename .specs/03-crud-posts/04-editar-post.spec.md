# 3.4 Editar Post (Update)

## Descrição
Implementar a funcionalidade de edição de posts existentes com pré-carregamento dos dados.

## Dependências
- 2.5 Proteção de Rotas
- 4.4 PostForm
- 7.1 postService
- 7.3 storageService

## Etapas

### Etapa 1 — Criar página EditPost
- Criar `src/pages/EditPost.jsx`
- Rota: `/admin/posts/edit/:id`
- Acessível apenas para o autor do post ou admin

### Etapa 2 — Carregar dados do post
- Extrair `id` dos parâmetros da URL via `useParams()`
- Buscar post do Firestore pelo ID
- Pré-preencher formulário com os dados atuais
- Tratar caso de post não encontrado

### Etapa 3 — Verificar permissão
- Comparar `authorId` do post com `user.uid` do AuthContext
- Verificar se o usuário tem role `admin`
- Se não tiver permissão: redirecionar para Home com mensagem

### Etapa 4 — Reutilizar PostForm
- Usar componente `PostForm` com prop `initialData` preenchida
- Campos editáveis: `title`, `content`, `tags`, imagem de capa
- Exibir imagem de capa atual com opção de trocar

### Etapa 5 — Atualizar slug se título mudar
- Se o título for alterado, regenerar slug
- Verificar unicidade do novo slug (excluindo o post atual)

### Etapa 6 — Atualizar imagem de capa
- Se nova imagem for selecionada:
  - Deletar imagem anterior do Storage (se existir)
  - Fazer upload da nova imagem
  - Atualizar `imageURL` do post

### Etapa 7 — Salvar alterações
- Chamar `postService.updatePost(id, data)` com os dados atualizados
- Exibir loading durante salvamento
- Em caso de sucesso: redirecionar para `/posts/:slug`
- Em caso de erro: exibir mensagem

## Critérios de Aceite
- [ ] Formulário é pré-preenchido com dados atuais do post
- [ ] Apenas autor ou admin consegue acessar a página de edição
- [ ] Slug é atualizado caso o título mude
- [ ] Imagem de capa pode ser substituída
- [ ] Post é atualizado corretamente no Firestore
- [ ] Após edição, usuário é redirecionado para o post atualizado
- [ ] Validação dos campos obrigatórios funciona

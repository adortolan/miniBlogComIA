# 3.5 Excluir Post (Delete)

## Descrição
Implementar a funcionalidade de exclusão de posts com diálogo de confirmação.

## Dependências
- 7.1 postService
- 2.1 AuthContext

## Etapas

### Etapa 1 — Criar componente de confirmação
- Criar modal/diálogo de confirmação de exclusão
- Exibir título do post que será excluído
- Botões: "Confirmar Exclusão" e "Cancelar"
- Estilização de alerta/perigo no botão de confirmação

### Etapa 2 — Verificar permissão
- Antes de permitir exclusão, verificar:
  - Usuário é o autor do post (`authorId === user.uid`)
  - Ou usuário tem role `admin`
- Se não tiver permissão: não exibir botão de exclusão

### Etapa 3 — Excluir documento do Firestore
- Chamar `postService.deletePost(id)`
- Remover documento da coleção `posts`

### Etapa 4 — Feedback e redirecionamento
- Exibir loading durante exclusão
- Em caso de sucesso: redirecionar para Home (`/`)
- Exibir toast/notificação de "Post excluído com sucesso"
- Em caso de erro: exibir mensagem e manter na página

## Critérios de Aceite
- [ ] Botão de excluir aparece apenas para autor ou admin
- [ ] Modal de confirmação é exibido antes da exclusão
- [ ] Post é removido do Firestore
- [ ] Usuário é redirecionado para Home após exclusão
- [ ] Feedback visual é exibido (loading + mensagem de sucesso/erro)

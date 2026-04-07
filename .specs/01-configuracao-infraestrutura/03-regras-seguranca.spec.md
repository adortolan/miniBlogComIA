# 1.3 Regras de Segurança (Firestore Security Rules)

## Descrição
Definir regras de segurança no Firestore e Storage para proteger dados e arquivos.

## Dependências
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Configurar regras do Firestore
- Editar `firestore.rules` na raiz do projeto
- Regras para coleção `posts`:
  - `read`: permitido para todos (público)
  - `create`: permitido apenas para usuários autenticados
  - `update`, `delete`: permitido apenas para o autor (`authorId == request.auth.uid`) ou admin
- Regras para coleção `users`:
  - `read`: permitido para todos
  - `write`: permitido apenas para o próprio usuário (`request.auth.uid == resource.id`)

### Etapa 2 — Configurar regras do Storage
- Editar `storage.rules` na raiz do projeto
- Upload permitido apenas para usuários autenticados
- Leitura pública para imagens de posts
- Limitar tamanho de upload (ex: máx 5MB)
- Restringir tipos de arquivo (apenas imagens: jpg, png, webp)

### Etapa 3 — Deploy das regras
- Executar `firebase deploy --only firestore:rules`
- Executar `firebase deploy --only storage:rules`
- Verificar no console que as regras foram aplicadas

## Critérios de Aceite
- [ ] Usuário não autenticado consegue ler posts mas não criar/editar
- [ ] Usuário autenticado consegue criar posts
- [ ] Apenas autor ou admin consegue editar/excluir posts
- [ ] Upload de imagens funciona apenas para usuários autenticados
- [ ] Regras estão deployadas no Firebase Console

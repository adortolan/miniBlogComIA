# 2.4 Registro de Usuário

## Descrição
Implementar página e funcionalidade de registro de novos usuários com email e senha.

## Dependências
- 2.1 AuthContext
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Criar página de Registro
- Criar `src/pages/Register.jsx`
- Layout com formulário contendo:
  - Campo de nome de exibição (`displayName`)
  - Campo de email
  - Campo de senha
  - Campo de confirmação de senha
  - Botão "Registrar"
  - Link para página de login

### Etapa 2 — Implementar registro com Firebase Auth
- Usar `createUserWithEmailAndPassword` do Firebase Auth
- Atualizar `displayName` com `updateProfile` após criação da conta
- Validações:
  - Email em formato válido
  - Senha com mínimo de 6 caracteres
  - Confirmação de senha deve coincidir

### Etapa 3 — Criar documento do usuário no Firestore
- Após registro bem-sucedido, criar documento na coleção `users`
- Campos:
  - `displayName`: nome informado no formulário
  - `photoURL`: string vazia ou URL padrão
  - `role`: `'reader'` (padrão para novos usuários)
- ID do documento = `uid` do Firebase Auth

### Etapa 4 — Redirecionamento pós-registro
- Após registro bem-sucedido, redirecionar para Home (`/`)
- O AuthContext já captura o novo usuário via `onAuthStateChanged`

### Etapa 5 — Configurar rota
- Adicionar rota `/register` no router
- Redirecionar para Home se o usuário já estiver logado

## Critérios de Aceite
- [ ] Página de registro renderiza corretamente em `/register`
- [ ] Novo usuário é criado no Firebase Auth
- [ ] Documento correspondente é criado na coleção `users` do Firestore
- [ ] `role` padrão é `'reader'`
- [ ] Validações de formulário funcionam (email, senha, confirmação)
- [ ] Mensagens de erro são exibidas (email já em uso, senha fraca)
- [ ] Usuário é redirecionado para Home após registro

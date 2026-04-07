# 2.2 Login

## Descrição
Implementar página e funcionalidade de login com Google e email/senha.

## Dependências
- 2.1 AuthContext

## Etapas

### Etapa 1 — Criar página de Login
- Criar `src/pages/Login.jsx`
- Layout com formulário de login contendo:
  - Campo de email
  - Campo de senha
  - Botão "Entrar"
  - Botão "Entrar com Google"
  - Link para página de registro

### Etapa 2 — Implementar login com Google
- Usar `signInWithPopup` do Firebase Auth com `GoogleAuthProvider`
- Tratar erros (popup bloqueado, conta cancelada)
- Exibir feedback visual durante o processo

### Etapa 3 — Implementar login com email/senha
- Usar `signInWithEmailAndPassword` do Firebase Auth
- Validar campos antes de enviar (email válido, senha não vazia)
- Exibir mensagens de erro específicas (usuário não encontrado, senha incorreta)

### Etapa 4 — Redirecionamento pós-login
- Após login bem-sucedido, redirecionar para Home (`/`)
- Se veio de uma rota protegida, redirecionar de volta para ela
- Usar `useNavigate` do React Router

### Etapa 5 — Configurar rota
- Adicionar rota `/login` no router da aplicação
- Redirecionar para Home se o usuário já estiver logado

## Critérios de Aceite
- [ ] Página de login renderiza corretamente em `/login`
- [ ] Login com Google funciona e redireciona para Home
- [ ] Login com email/senha funciona com validação
- [ ] Mensagens de erro são exibidas ao usuário
- [ ] Usuário já logado é redirecionado para Home ao acessar `/login`

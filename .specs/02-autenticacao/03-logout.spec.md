# 2.3 Logout

## Descrição
Implementar funcionalidade de logout acessível pela Navbar.

## Dependências
- 2.1 AuthContext
- 4.1 Navbar

## Etapas

### Etapa 1 — Implementar função de logout
- Usar `signOut` do Firebase Auth
- Limpar estado do usuário no AuthContext

### Etapa 2 — Adicionar botão na Navbar
- Exibir botão "Sair" na Navbar apenas quando o usuário estiver logado
- Ao clicar, executar a função de logout

### Etapa 3 — Redirecionamento pós-logout
- Após logout, redirecionar para Home (`/`)
- Garantir que o estado da aplicação é limpo

## Critérios de Aceite
- [ ] Botão de logout aparece apenas para usuários logados
- [ ] Ao clicar em logout, o usuário é deslogado e redirecionado para Home
- [ ] Estado do AuthContext é atualizado para `user: null`
- [ ] Rotas protegidas não são mais acessíveis após logout

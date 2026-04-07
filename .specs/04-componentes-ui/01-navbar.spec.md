# 4.1 Navbar

## Descrição
Implementar componente de navegação principal responsivo com estado dinâmico baseado na autenticação.

## Dependências
- 2.1 AuthContext

## Etapas

### Etapa 1 — Criar componente Navbar
- Criar `src/components/Navbar.jsx`
- Layout com:
  - Logo/nome do blog (link para Home `/`)
  - Menu de navegação

### Etapa 2 — Links de navegação
- **Sempre visíveis**: Home
- **Usuário deslogado**: "Entrar" (link para `/login`), "Registrar" (link para `/register`)
- **Usuário logado**: "Novo Post" (link para `/admin/posts/new`), "Sair" (botão de logout)
- **Admin**: "Dashboard" (link para `/admin`)

### Etapa 3 — Exibir dados do usuário logado
- Mostrar `displayName` e/ou `photoURL` do usuário
- Usar dados do `useAuthContext()`

### Etapa 4 — Responsividade
- Menu hamburger para telas pequenas (mobile)
- Menu dropdown no mobile com os mesmos links
- Transição suave ao abrir/fechar menu mobile

### Etapa 5 — Integrar no layout
- Adicionar `Navbar` no layout principal (acima do conteúdo)
- Presente em todas as páginas

## Critérios de Aceite
- [ ] Navbar exibe links corretos conforme estado de autenticação
- [ ] Logo redireciona para Home
- [ ] Nome/foto do usuário logado são exibidos
- [ ] Menu responsivo funciona em mobile
- [ ] Navbar está presente em todas as páginas

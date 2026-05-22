# 004 - Roteamento e Permissões

**Tags:** routing, guards, roles  
**Criado:** 2026-05-22

## Estrutura de Rotas

```
/                        → Home (público)
/posts/:slug             → PostDetail (público)
/login                   → Login (público)
/registro                → Register (público)

[PrivateRoute] (requer autenticação)
├── /dashboard           → Dashboard
├── /criar-post          → CreatePost
└── /admin/posts/edit/:id → EditPost

[AdminRoute] (requer role "admin")
└── /admin               → AdminPanel
```

## Guards

### PrivateRoute
- Localização: `src/components/PrivateRoute.tsx`
- Verifica: `isAuthenticated` via AuthContext
- Se loading: exibe spinner
- Se não autenticado: `Navigate to="/login"` com state `{ from: location }`
- Se ok: renderiza `<Outlet />`

### AdminRoute
- Localização: `src/components/AdminRoute.tsx`
- Verifica: autenticação + `users/{uid}.role === 'admin'` via getDoc no Firestore
- Se loading (auth OU role check): exibe spinner
- Se não autenticado: redireciona para `/login`
- Se não é admin: redireciona para `/` com mensagem de acesso negado
- Se ok: renderiza `<Outlet />`

## Navegação

### Navbar (`src/components/Navbar.tsx`)
Exibe links condicionais baseado em `isAuthenticated`:

**Não autenticado:**
- Home
- Entrar
- Explorar artigos (link para /registro)
- Ícone de busca

**Autenticado:**
- Home
- Criar Post
- Dashboard
- Saudação + botão Sair

### Navegação programática
- Após login bem-sucedido → navega conforme `state.from` ou `/`
- Após logout → navega para `/`
- Após criar post → navega para home ou post
- Após excluir post → navega para `/`
- Após editar → navega para o post

## Gotchas

- A URL de posts usa **slug** (não ID): `/posts/:slug`
- A URL de edição usa **ID** (não slug): `/admin/posts/edit/:id`
- AdminRoute faz query ao Firestore a cada montagem (sem cache)
- O PrivateRoute preserva a localização original no state para redirect após login

## Referências

- `src/App.tsx`: Definição de todas as rotas
- `src/components/PrivateRoute.tsx`: Guard de autenticação
- `src/components/AdminRoute.tsx`: Guard de admin
- `src/components/Navbar.tsx`: Navegação global

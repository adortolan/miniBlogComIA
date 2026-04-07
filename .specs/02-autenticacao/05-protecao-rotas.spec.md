# 2.5 Proteção de Rotas

## Descrição
Implementar componentes de proteção de rotas para restringir acesso a áreas autenticadas e administrativas.

## Dependências
- 2.1 AuthContext
- 6.1 Rotas (definição das rotas)

## Etapas

### Etapa 1 — Criar componente PrivateRoute
- Criar `src/components/PrivateRoute.jsx`
- Verificar se o usuário está autenticado via `useAuthContext()`
- Se autenticado: renderizar o componente filho (`<Outlet />`)
- Se não autenticado: redirecionar para `/login`
- Enquanto `loading`: exibir spinner/loading

### Etapa 2 — Criar componente AdminRoute
- Criar `src/components/AdminRoute.jsx`
- Além de verificar autenticação, verificar `role === 'admin'`
- Buscar role do usuário no Firestore (coleção `users`)
- Se não for admin: redirecionar para Home com mensagem de acesso negado

### Etapa 3 — Aplicar nas rotas
- Envolver rotas `/admin/*` com `PrivateRoute`
- Envolver rotas de gerenciamento com `AdminRoute` onde necessário
- Exemplo de estrutura:
  ```jsx
  <Route element={<PrivateRoute />}>
    <Route path="/admin" element={<Dashboard />} />
    <Route path="/admin/posts/new" element={<CreatePost />} />
    <Route path="/admin/posts/edit/:id" element={<EditPost />} />
  </Route>
  ```

### Etapa 4 — Redirecionar usuário logado do login
- Na página de Login e Registro, se o usuário já estiver logado, redirecionar para Home

## Critérios de Aceite
- [ ] Usuário não autenticado é redirecionado para `/login` ao acessar rotas protegidas
- [ ] Usuário autenticado acessa normalmente as rotas protegidas
- [ ] Usuário sem role `admin` não acessa rotas administrativas restritas
- [ ] Loading é exibido durante verificação do estado de autenticação
- [ ] Usuário logado não consegue acessar `/login` e `/register`

# 6.1 Rotas (React Router)

## Descrição
Configurar todas as rotas da aplicação com React Router, incluindo rotas públicas e protegidas.

## Dependências
- 2.5 Proteção de Rotas
- Todas as páginas (Home, Login, Register, PostDetail, CreatePost, EditPost, Dashboard)

## Etapas

### Etapa 1 — Instalar e configurar React Router
- `react-router-dom` já instalado (feature 1.1)
- Criar `BrowserRouter` em `src/main.jsx`

### Etapa 2 — Definir layout principal
- Criar componente de layout com `Navbar` + `<Outlet />` + `Footer`
- Todas as rotas renderizam dentro deste layout

### Etapa 3 — Configurar rotas públicas
| Rota             | Componente   | Descrição               |
|------------------|--------------|-------------------------|
| `/`              | Home         | Listagem de posts       |
| `/login`         | Login        | Página de login         |
| `/register`      | Register     | Página de registro      |
| `/posts/:slug`   | PostDetail   | Detalhe de um post      |

### Etapa 4 — Configurar rotas protegidas
| Rota                       | Componente   | Proteção        |
|----------------------------|--------------|-----------------|
| `/admin`                   | Dashboard    | PrivateRoute    |
| `/admin/posts/new`         | CreatePost   | PrivateRoute    |
| `/admin/posts/edit/:id`    | EditPost     | PrivateRoute    |

### Etapa 5 — Configurar rota 404
- Criar página `NotFound` para rotas inexistentes
- Rota catch-all: `path="*"`

### Etapa 6 — Estrutura final do router
```jsx
<BrowserRouter>
  <AuthProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/posts/new" element={<CreatePost />} />
          <Route path="/admin/posts/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

## Critérios de Aceite
- [ ] Todas as rotas públicas são acessíveis sem autenticação
- [ ] Rotas protegidas redirecionam para `/login` quando não autenticado
- [ ] Layout com Navbar e Footer está presente em todas as páginas
- [ ] Rota 404 captura URLs inexistentes
- [ ] Navegação entre páginas funciona sem reload

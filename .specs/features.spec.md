# Mini Blog - Especificação de Features

> Baseado em: `Projeto.md` — React + Firebase (Serverless)

---

## 1. Configuração e Infraestrutura

### 1.1 Setup do Projeto
- Inicializar projeto React com Vite
- Instalar dependências: `firebase`, `react-router-dom`, `react-markdown`
- Configurar variáveis de ambiente (`.env.local`) com chaves do Firebase
- Configurar arquivo `firebase.js` em `src/config/`

### 1.2 Configuração do Firebase
- Inicializar Firestore Database
- Inicializar Firebase Authentication

### 1.3 Regras de Segurança (Firestore Security Rules)
- `posts`: leitura pública, escrita restrita ao autor/admin
- `users`: leitura pública do perfil, escrita restrita ao próprio usuário

---

## 2. Autenticação (Auth)

### 2.1 AuthContext
- Criar `AuthContext` com estado global do usuário logado
- Provider envolvendo toda a aplicação
- Expor dados do usuário, status de loading e métodos de login/logout

### 2.2 Login
- Página de Login (`/login`)
- Login com Google (Firebase Auth)
- Redirecionamento pós-login para Home

### 2.3 Logout
- Botão de logout na Navbar
- Limpeza do estado de autenticação

### 2.4 Registro de Usuário
- Registro com email e senha (Firebase Auth)
- Criação automática do documento na coleção `users` com `displayName`, `photoURL` e `role: 'reader'`

### 2.5 Proteção de Rotas
- Rotas privadas (área admin) acessíveis apenas por usuários autenticados
- Redirecionamento para `/login` quando não autenticado
- Verificação de role `admin` para rotas de gerenciamento

---

## 3. CRUD de Posts

### 3.1 Criar Post (Create)
- Página/formulário de criação (`/admin/posts/new`)
- Campos: `title`, `content` (textarea/Markdown), `tags`, `imageURL` (URL da imagem)
- Geração automática de `slug` a partir do `title`
- Preenchimento automático de `authorId` e `createdAt`
- Validação dos campos obrigatórios (title, content)
- Redirecionamento para o post criado após sucesso

### 3.2 Listar Posts (Read - List)
- Página Home (`/`) com listagem de todos os posts
- Componente `PostCard` exibindo: título, trecho do conteúdo, tags, autor e data
- Ordenação por `createdAt` (mais recente primeiro)
- Atualização em tempo real via `onSnapshot`

### 3.3 Visualizar Post (Read - Detail)
- Página de detalhe do post (`/posts/:slug`)
- Renderização do conteúdo Markdown com `react-markdown`
- Exibição de: título, conteúdo completo, autor, data de criação, tags, imagem de capa
- Botões de editar/excluir visíveis apenas para o autor ou admin

### 3.4 Editar Post (Update)
- Página/formulário de edição (`/admin/posts/edit/:id`)
- Pré-carregamento dos dados atuais do post no formulário
- Campos editáveis: `title`, `content`, `tags`, `imageURL`
- Re-geração do `slug` caso o título mude
- Validação dos campos obrigatórios
- Permissão: apenas autor do post ou admin

### 3.5 Excluir Post (Delete)
- Botão de exclusão com modal/diálogo de confirmação
- Remoção do documento da coleção `posts` no Firestore
- Permissão: apenas autor do post ou admin
- Redirecionamento para Home após exclusão

### 3.6 Buscar Posts por Tag
- Filtro de posts por tag na Home
- Query Firestore com `where('tags', 'array-contains', tag)`

---

## 4. Componentes de UI

### 4.1 Navbar
- Logo/nome do blog
- Links de navegação: Home, Login/Logout
- Link para área Admin (visível apenas para admin)
- Exibição do nome/foto do usuário logado

### 4.2 Footer
- Informações do blog
- Links úteis

### 4.3 PostCard
- Card para listagem de posts
- Exibição de: título, trecho, tags, autor, data
- Link para página de detalhe do post

### 4.4 PostForm
- Formulário reutilizável para criação e edição de posts
- Campos: título, conteúdo (editor Markdown), tags (input com chips), imageURL (URL da imagem)
- Botões: Salvar, Cancelar

---

## 5. Hooks Customizados

### 5.1 useAuth
- Encapsula lógica de autenticação
- Métodos: `login`, `logout`, `register`
- Estado: `user`, `isAuthenticated`, `loading`

### 5.2 useFirestore
- Encapsula operações CRUD genéricas no Firestore
- Métodos: `addDocument`, `updateDocument`, `deleteDocument`
- Suporte a listeners em tempo real (`onSnapshot`)

### 5.3 usePosts
- Hook específico para operações com posts
- Métodos: `createPost`, `getPost`, `getPosts`, `updatePost`, `deletePost`
- Filtros: por tag, por autor

---

## 6. Páginas (Routes)

| Rota                      | Página         | Acesso          |
|---------------------------|----------------|-----------------|
| `/`                       | Home           | Público         |
| `/login`                  | Login          | Público         |
| `/register`               | Registro       | Público         |
| `/posts/:slug`            | Post Detail    | Público         |
| `/admin`                  | Dashboard      | Autenticado     |
| `/admin/posts/new`        | Criar Post     | Autenticado     |
| `/admin/posts/edit/:id`   | Editar Post    | Autor/Admin     |

---

## 7. Services (Camada de Serviço)

### 7.1 postService
- `createPost(data)` — cria documento em `posts`
- `getPostBySlug(slug)` — busca post por slug
- `getAllPosts()` — retorna todos os posts ordenados
- `getPostsByTag(tag)` — filtra posts por tag
- `updatePost(id, data)` — atualiza documento
- `deletePost(id)` — remove documento
- `subscribeToPostsRealtime(callback)` — listener em tempo real

### 7.2 authService
- `loginWithGoogle()` — login via Google
- `registerWithEmail(email, password)` — registro
- `logout()` — encerrar sessão
- `getCurrentUser()` — retorna usuário atual


---

## 8. Estilização

### 8.1 Setup de Estilos
- Configuração de CSS Modules ou TailwindCSS
- Tema responsivo (mobile-first)
- Layout base com Navbar + conteúdo + Footer

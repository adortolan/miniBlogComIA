# 001 - Arquitetura Geral

**Tags:** architecture, overview  
**Criado:** 2026-05-22

## Stack

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | React | 19.x |
| Build Tool | Vite | 5.x |
| Linguagem | TypeScript | 5.7+ (strict mode) |
| Estilização | TailwindCSS | 3.4 |
| Roteamento | React Router DOM | 7.x |
| Backend | Firebase (serverless) | 10.x |
| Auth | Firebase Authentication | Google + Email/Password |
| Database | Firestore (NoSQL) | Real-time + one-shot queries |
| Markdown | react-markdown | 9.x |
| Testes | Vitest + Testing Library | 2.x |

## Estrutura de Diretórios

```
src/
├── App.tsx                  # Raiz: BrowserRouter + Routes
├── main.tsx                 # Entry point: AuthProvider → App
├── config/
│   └── firebase.ts          # Inicialização Firebase (auth + db exports)
├── types/
│   ├── index.ts             # Tipos de domínio (Post, DTOs, interfaces)
│   └── firebase.ts          # Re-exports de tipos Firebase
├── contexts/
│   └── AuthContext.tsx       # Provider + hook useAuth/useAuthContext
├── components/
│   ├── Navbar.tsx            # Navegação global
│   ├── PostCard.tsx          # Card de preview de post
│   ├── PostForm.tsx          # Formulário reutilizável (criar/editar)
│   ├── TagFilter.tsx         # Filtro por tags
│   ├── DeleteConfirmModal.tsx # Modal de confirmação de exclusão
│   ├── PrivateRoute.tsx      # Guard: requer autenticação
│   ├── AdminRoute.tsx        # Guard: requer role "admin"
│   ├── HeroSection.tsx       # Hero da home
│   ├── AuthStatus.tsx        # Indicador de status de auth
│   └── FirebaseTest.tsx      # Componente de teste de conexão
├── hooks/
│   ├── usePosts.ts           # Busca posts (realtime ou one-shot)
│   ├── usePostsByTag.ts      # Busca posts filtrados por tag
│   ├── useCreatePost.ts      # Criação com slug auto-gerado
│   ├── useUpdatePost.ts      # Atualização com re-geração de slug
│   ├── useDeletePost.ts      # Exclusão de post
│   ├── useLogin.ts           # Login email/senha + Google
│   ├── useRegister.ts        # Registro com criação de perfil
│   ├── useLogout.ts          # Logout
│   └── useUserRole.ts        # Busca role do Firestore
├── pages/
│   ├── Home.tsx              # Lista de posts + filtro por tag
│   ├── PostDetail.tsx        # Detalhes do post (Markdown render)
│   ├── Login.tsx             # Página de login
│   ├── Register.tsx          # Página de registro
│   ├── CreatePost.tsx        # Criação de novo post
│   ├── EditPost.tsx          # Edição de post existente
│   ├── Dashboard.tsx         # Dashboard do usuário
│   └── AdminPanel.tsx        # Painel administrativo
├── services/
│   └── postService.ts        # CRUD Firestore (implementa PostService)
├── utils/
│   ├── generateSlug.ts       # Geração de slug URL-friendly
│   └── formatDate.ts         # Formatação de timestamps
├── styles/
│   └── index.css             # CSS global + Tailwind directives
└── test/
    ├── setup.ts              # Setup de testes (Vitest)
    └── README.md             # Docs sobre testes
```

## Diagrama de Camadas

```
┌──────────────────────────────────────────────┐
│                    Pages                       │
│  Home, PostDetail, Login, Register, etc.      │
├──────────────────────────────────────────────┤
│              Components                       │
│  Navbar, PostCard, PostForm, TagFilter, etc.  │
├──────────────────────────────────────────────┤
│         Hooks (lógica de negócio)             │
│  usePosts, useCreatePost, useLogin, etc.      │
├──────────────────────────────────────────────┤
│        Context (estado global)                │
│  AuthContext (user, loading, isAuthenticated) │
├──────────────────────────────────────────────┤
│          Services                             │
│  postService (CRUD Firestore)                 │
├──────────────────────────────────────────────┤
│         Config + Utils                        │
│  firebase.ts, generateSlug, formatDate        │
├──────────────────────────────────────────────┤
│       Firebase (external)                     │
│  Firestore + Authentication                   │
└──────────────────────────────────────────────┘
```

## Modelo de Dados (Firestore)

### Collection: `posts`
```typescript
interface Post {
  id: string;
  title: string;
  content: string;        // Markdown
  slug: string;           // URL-friendly, auto-gerado
  tags: string[];
  imageURL?: string;      // URL externa
  authorId: string;
  authorName?: string;
  authorPhotoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `users`
```typescript
interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  role: 'admin' | 'reader';  // roles do sistema
  createdAt?: string;         // ISO string (criado no register)
}
```

## Build & Dev Commands

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server na porta 3000 |
| `npm run build` | `tsc && vite build` |
| `npm run lint` | ESLint com TS rules |
| `npm run type-check` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run test:coverage` | Vitest com coverage |

## Configurações Notáveis

- **Vite:** porta 3000, proxy para Firebase CORS
- **TypeScript:** strict mode, noEmit, exclui `.test.ts(x)` do build principal
- **Tailwind:** cores customizadas `primary` (cyan) e `dark` (dark theme)
- **Vitest:** ambiente jsdom, setup em `src/test/setup.js`
- **Firebase:** validação rigorosa de config com mensagens CORS customizadas

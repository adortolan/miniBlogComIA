# Plano de Migração TypeScript - MiniBlog

## Visão Geral
Este documento descreve o plano automatizado para migração do MiniBlog de JavaScript para TypeScript, projetado para ser executado por agentes de IA de forma autônoma.

## Pré-requisitos
- Node.js e npm instalados
- Git configurado
- Branch `develop` atualizado
- Todos os testes passando em JavaScript

## Estrutura de Execução com PRs e Testes Web

**Estratégia de Migração por Fases:**
- Cada fase termina com um Pull Request separado
- Após cada PR, executar testes web manuais completos
- Só prosseguir para próxima fase após validação bem-sucedida
- Merge do PR para develop antes de iniciar próxima fase
- Rollback fácil se qualquer fase apresentar problemas

**Fluxo de Cada Fase:**
1. Executar mudanças da fase
2. Commit das mudanças
3. Push para branch remoto
4. Criar Pull Request
5. Executar testes automatizados (CI)
6. Executar testes web manuais
7. Validar funcionamento completo
8. Aprovar e merge PR para develop
9. Iniciar próxima fase

---

### FASE 1: Preparação e Configuração (30-45 minutos)

#### 1.1 Setup Inicial
```bash
# Backup do estado atual
git checkout -b feature/typescript-migration
git add .
git commit -m "backup: estado pré-migração typescript"

# Instalar dependências TypeScript
npm install --save-dev typescript @types/node @types/react @types/react-dom
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### 1.2 Configuração TypeScript
Criar `tsconfig.json` com:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Criar `tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

#### 1.3 Atualizar Vite Config
Renomear `vite.config.js` → `vite.config.ts` e atualizar para TypeScript.

#### 1.4 Atualizar ESLint
Atualizar `.eslintrc.cjs` para suportar TypeScript:
```javascript
module.exports = {
  // ... config existente
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    // ... extends existentes
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    // ... parserOptions existentes
    parser: '@typescript-eslint/parser'
  }
}
```

#### 1.5 Atualizar Package Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

**Checkpoint 1:** `npm run type-check` deve executar (com erros esperados)

#### 1.6 Commit e Pull Request FASE 1
```bash
# Commit das mudanças
git add .
git commit -m "feat(phase-1): adicionar configuração TypeScript base

- Instalar dependências TypeScript
- Criar tsconfig.json e tsconfig.node.json
- Migrar vite.config.js para TypeScript
- Atualizar ESLint para TypeScript
- Adicionar scripts de type-check e build

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

# Push para branch remoto
git push origin feature/ts-phase-1-config
```

#### 1.7 Criar Pull Request
Criar PR com título: `feat(phase-1): Adicionar configuração TypeScript base`

Descrição do PR:
```
## Mudanças
- Instalação de TypeScript e dependências relacionadas
- Configuração tsconfig.json com opções estritas
- Configuração tsconfig.node.json para arquivos de configuração
- Migração de vite.config.js para vite.config.ts
- Atualização de ESLint para suportar TypeScript
- Adição de scripts: type-check, build com TS

## Validação
- [ ] CI/CD passando
- [ ] Type-check executando (erros esperados nesta fase)
- [ ] Build funcionando
```

#### 1.8 Testes Web Manuais - FASE 1
```bash
# Instalar dependências e iniciar dev server
npm install
npm run dev
```

**Validações Manuais:**
1. Abrir http://localhost:3000 no navegador
2. Verificar se aplicação carrega sem erros no console
3. Verificar se hot-reload ainda funciona
4. Testar navegação básica entre páginas
5. Verificar se não há erros de TypeScript no console

**Critérios de Sucesso:**
- [ ] Aplicação inicia sem erros
- [ ] Hot-reload funcional
- [ ] Navegação básica funcionando
- [ ] Zero erros no console do navegador

#### 1.9 Merge e Preparação Próxima Fase
```bash
# Após validação bem-sucedida e CI passando
git checkout develop
git merge feature/ts-phase-1-config
git push origin develop

# Criar branch para próxima fase
git checkout -b feature/ts-phase-2-types
```

---

### FASE 2: Definição de Tipos Base (1-2 horas)

#### 2.1 Criar Estrutura de Types
Criar arquivo `src/types/index.ts`:

```typescript
// Firebase Types
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Domain Types
export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  imageURL?: string;
  authorId: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  tags: string[];
  imageURL?: string;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  tags?: string[];
  imageURL?: string;
}

// Context Types
export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Service Types
export interface PostService {
  createPost(postData: CreatePostDTO): Promise<Post>;
  getAllPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | null>;
  getPostBySlug(slug: string): Promise<Post | null>;
  updatePost(id: string, postData: UpdatePostDTO): Promise<void>;
  deletePost(id: string): Promise<void>;
  getPostsByTag(tag: string): Promise<Post[]>;
  checkSlugUniqueness(slug: string, excludeId?: string | null): Promise<boolean>;
  subscribeToPostsRealtime(
    callback: (posts: Post[]) => void,
    errorCallback?: (error: Error) => void
  ): () => void;
}

// Hook Return Types
export interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export interface UseMutationResult<T> {
  mutate: (data: T) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface PostCardProps {
  post: Post;
}

export interface PostFormProps {
  initialData?: Partial<Post>;
  onSubmit: (data: CreatePostDTO | UpdatePostDTO) => Promise<void>;
  onCancel?: () => void;
}

export interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}
```

#### 2.2 Criar Types para Firebase
Criar `src/types/firebase.ts`:
```typescript
import { User as FirebaseUser } from 'firebase/auth';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export type { FirebaseUser };
export type FirebaseDocumentData = DocumentData;
export type FirebaseQueryDocumentSnapshot = QueryDocumentSnapshot<DocumentData, DocumentData>;
```

**Checkpoint 2:** `npm run type-check` deve reconhecer os tipos (ainda com erros nos arquivos JS)

#### 2.3 Commit e Pull Request FASE 2
```bash
# Commit das mudanças
git add src/types/
git commit -m "feat(phase-2): adicionar definições de tipos TypeScript

- Criar src/types/index.ts com interfaces do domínio
- Criar src/types/firebase.ts com tipos do Firebase
- Definir interfaces para Post, User, Contexts, Services
- Definir tipos para Hooks e Components

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

# Push para branch remoto
git push origin feature/ts-phase-2-types
```

#### 2.4 Criar Pull Request
Criar PR com título: `feat(phase-2): Adicionar definições de tipos TypeScript`

Descrição do PR:
```
## Mudanças
- Criação de src/types/index.ts com todas as interfaces do domínio
- Criação de src/types/firebase.ts com tipos do Firebase
- Definição de tipos para Post, CreatePostDTO, UpdatePostDTO
- Definição de tipos para AuthContext, PostService
- Definição de tipos para Hooks e Components

## Validação
- [ ] CI/CD passando
- [ ] Type-check reconhecendo os novos tipos
- [ ] Build funcionando
```

#### 2.5 Testes Web Manuais - FASE 2
```bash
# Instalar dependências e iniciar dev server
npm install
npm run dev
```

**Validações Manuais:**
1. Abrir http://localhost:3000 no navegador
2. Verificar se aplicação carrega sem erros no console
3. Verificar se hot-reload ainda funciona
4. Testar navegação básica entre páginas
5. Verificar se os tipos estão sendo reconhecidos (sem erros de compilação)

**Critérios de Sucesso:**
- [ ] Aplicação inicia sem erros
- [ ] Hot-reload funcional
- [ ] Navegação básica funcionando
- [ ] Zero erros no console do navegador
- [ ] TypeScript reconhecendo os novos tipos

#### 2.6 Merge e Preparação Próxima Fase
```bash
# Após validação bem-sucedida e CI passando
git checkout develop
git merge feature/ts-phase-2-types
git push origin develop

# Criar branch para próxima fase
git checkout -b feature/ts-phase-3-utils
```

---

### FASE 3: Migração de Utils e Config (1 hora)

#### 3.1 Migrar Arquivos de Configuração
1. Renomear `src/config/firebase.js` → `src/config/firebase.ts`
2. Adicionar tipagem para variáveis de ambiente
3. Remover PropTypes se existirem

#### 3.2 Migrar Utils
1. Renomear `src/utils/formatDate.js` → `src/utils/formatDate.ts`
2. Adicionar tipos para parâmetros e retorno
3. Renomear `src/utils/generateSlug.js` → `src/utils/generateSlug.ts`

**Checkpoint 3:** Utils migrados devem passar no type-check

#### 3.3 Commit e Pull Request FASE 3
```bash
# Commit das mudanças
git add src/config/ src/utils/
git commit -m "refactor(phase-3): migrar utils e config para TypeScript

- Migrar src/config/firebase.js para TypeScript
- Migrar src/utils/formatDate.js para TypeScript
- Migrar src/utils/generateSlug.js para TypeScript
- Adicionar tipagem para todas as funções

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

# Push para branch remoto
git push origin feature/ts-phase-3-utils
```

#### 3.4 Criar Pull Request
Criar PR com título: `refactor(phase-3): Migrar utils e config para TypeScript`

Descrição do PR:
```
## Mudanças
- Migração de firebase.js para firebase.ts
- Migração de formatDate.js para formatDate.ts
- Migração de generateSlug.js para generateSlug.ts
- Adição de tipos para parâmetros e retornos

## Validação
- [ ] CI/CD passando
- [ ] Type-check passando para utils/config
- [ ] Testes unitários passando
- [ ] Build funcionando
```

#### 3.5 Testes Web Manuais - FASE 3
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Abrir http://localhost:3000 no navegador
2. Verificar se aplicação carrega sem erros
3. Testar conexão com Firebase (ver console)
4. Testar formatação de datas na UI
5. Testar geração de slugs (criar um post)

**Critérios de Sucesso:**
- [ ] Aplicação inicia sem erros
- [ ] Firebase conectando corretamente
- [ ] Datas formatadas corretamente
- [ ] Slugs gerados corretamente
- [ ] Zero erros no console

#### 3.6 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-3-utils
git push origin develop
git checkout -b feature/ts-phase-4-services
```

---

### FASE 4: Migração de Services (1-2 horas)

#### 4.1 Migrar postService
1. Renomear `src/services/postService.js` → `src/services/postService.ts`
2. Adicionar tipos para todos os métodos
3. Usar interfaces definidas em `src/types/index.ts`
4. Remover comentários JSDoc redundantes

#### 4.2 Validar Service
```bash
npm run type-check
npm test -- src/services/postService.test.ts
```

**Checkpoint 4:** Service migrado e testes passando

#### 4.3 Commit e Pull Request FASE 4
```bash
git add src/services/
git commit -m "refactor(phase-4): migrar services para TypeScript

- Migrar postService.js para TypeScript
- Adicionar tipagem para todos os métodos do service
- Implementar interface PostService
- Remover comentários JSDoc redundantes

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-4-services
```

#### 4.4 Criar Pull Request
PR: `refactor(phase-4): Migrar services para TypeScript`

#### 4.5 Testes Web Manuais - FASE 4
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Testar listagem de posts
2. Testar criação de post
3. Testar busca de post por slug
4. Testar atualização de post
5. Testar deleção de post
6. Verificar operações CRUD no Firestore

**Critérios de Sucesso:**
- [ ] Todas operações CRUD funcionando
- [ ] Posts listados corretamente
- [ ] Posts criados/atualizados/deletados
- [ ] Zero erros no console

#### 4.6 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-4-services
git push origin develop
git checkout -b feature/ts-phase-5-contexts
```

---

### FASE 5: Migração de Contexts (1 hora)

#### 5.1 Migrar AuthContext
1. Renomear `src/contexts/AuthContext.jsx` → `src/contexts/AuthContext.tsx`
2. Substituir PropTypes por interfaces TypeScript
3. Adicionar tipos para context value
4. Tipar hooks customizados

#### 5.2 Validar Context
```bash
npm run type-check
npm test -- src/contexts/AuthContext.test.tsx
```

**Checkpoint 5:** Context migrado e testes passando

#### 5.3 Commit e Pull Request FASE 5
```bash
git add src/contexts/
git commit -m "refactor(phase-5): migrar contexts para TypeScript

- Migrar AuthContext.jsx para TypeScript
- Substituir PropTypes por interfaces TypeScript
- Implementar interface AuthContextType
- Tipar hooks customizados do context

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-5-contexts
```

#### 5.4 Criar Pull Request
PR: `refactor(phase-5): Migrar contexts para TypeScript`

#### 5.5 Testes Web Manuais - FASE 5
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Testar login com Google
2. Testar login com email/senha
3. Testar registro de novo usuário
4. Testar logout
5. Verificar estado de autenticação na UI
6. Verificar persistência de sessão

**Critérios de Sucesso:**
- [ ] Login/Registro funcionando
- [ ] Logout funcionando
- [ ] Estado de auth atualizando corretamente
- [ ] Sessão persistindo
- [ ] Zero erros no console

#### 5.6 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-5-contexts
git push origin develop
git checkout -b feature/ts-phase-6-hooks
```

---

### FASE 6: Migração de Hooks (2-3 horas)

#### 6.1 Migrar Hooks em Ordem
1. `useLogin.js` → `useLogin.ts`
2. `useRegister.js` → `useRegister.ts`
3. `useLogout.js` → `useLogout.ts`
4. `useUserRole.js` → `useUserRole.ts`
5. `usePosts.js` → `usePosts.ts`
6. `usePostsByTag.js` → `usePostsByTag.ts`
7. `useCreatePost.js` → `useCreatePost.ts`
8. `useUpdatePost.js` → `useUpdatePost.ts`
9. `useDeletePost.js` → `useDeletePost.ts`

#### 6.2 Padrão de Migração para Hooks
```typescript
// Antes
export const usePosts = (options = {}) => {
  const { realtime = false } = options;
  // ...
}

// Depois
interface UsePostsOptions {
  realtime?: boolean;
}

export const usePosts = (options: UsePostsOptions = {}): UsePostsResult => {
  const { realtime = false } = options;
  // ...
}
```

#### 6.3 Validar Cada Hook
```bash
npm run type-check
npm test -- src/hooks/<hook-name>.test.ts
```

**Checkpoint 6:** Todos os hooks migrados e testes passando

#### 6.4 Commit e Pull Request FASE 6
```bash
git add src/hooks/
git commit -m "refactor(phase-6): migrar hooks para TypeScript

- Migrar todos os hooks customizados para TypeScript
- Adicionar interfaces para options e retornos
- Tipar parâmetros e retornos de todos os hooks
- Implementar interfaces UsePostsResult, UseMutationResult

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-6-hooks
```

#### 6.5 Criar Pull Request
PR: `refactor(phase-6): Migrar hooks para TypeScript`

#### 6.6 Testes Web Manuais - FASE 6
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Testar hook useLogin (fluxo de login)
2. Testar hook useRegister (fluxo de registro)
3. Testar hook useLogout (fluxo de logout)
4. Testar hook usePosts (listagem de posts)
5. Testar hook useCreatePost (criação de post)
6. Testar hook useUpdatePost (atualização de post)
7. Testar hook useDeletePost (deleção de post)
8. Testar hook usePostsByTag (filtro por tag)

**Critérios de Sucesso:**
- [ ] Todos os hooks funcionando corretamente
- [ ] Operações de auth funcionando
- [ ] Operações de posts funcionando
- [ ] Estados de loading/error corretos
- [ ] Zero erros no console

#### 6.7 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-6-hooks
git push origin develop
git checkout -b feature/ts-phase-7-components
```

---

### FASE 7: Migração de Components (3-4 horas)

#### 7.1 Ordem de Migração de Components
1. `TagFilter.jsx` → `TagFilter.tsx`
2. `DeleteConfirmModal.jsx` → `DeleteConfirmModal.tsx`
3. `AuthStatus.jsx` → `AuthStatus.tsx`
4. `PrivateRoute.jsx` → `PrivateRoute.tsx`
5. `AdminRoute.jsx` → `AdminRoute.tsx`
6. `PostCard.jsx` → `PostCard.tsx`
7. `PostForm.jsx` → `PostForm.tsx`
8. `Navbar.jsx` → `Navbar.tsx`
9. `HeroSection.jsx` → `HeroSection.tsx`
10. `FirebaseTest.jsx` → `FirebaseTest.tsx` (se ainda usado)

#### 7.2 Padrão de Migração para Components
```typescript
// Antes
import PropTypes from 'prop-types';

export const PostCard = ({ post }) => {
  // ...
}

PostCard.propTypes = {
  post: PropTypes.shape({
    // ...
  }).isRequired,
};

// Depois
import { PostCardProps } from '../types';

export const PostCard = ({ post }: PostCardProps) => {
  // ...
}
```

#### 7.3 Validar Cada Component
```bash
npm run type-check
npm test -- src/components/<component-name>.test.tsx
```

**Checkpoint 7:** Todos os components migrados e testes passando

#### 7.4 Commit e Pull Request FASE 7
```bash
git add src/components/
git commit -m "refactor(phase-7): migrar components para TypeScript

- Migrar todos os components para TypeScript
- Substituir PropTypes por interfaces TypeScript
- Implementar interfaces de props para cada component
- Tipar event handlers e callbacks

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-7-components
```

#### 7.5 Criar Pull Request
PR: `refactor(phase-7): Migrar components para TypeScript`

#### 7.6 Testes Web Manuais - FASE 7
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Testar todos os components individualmente
2. Testar PostCard (renderização, cliques)
3. Testar PostForm (criação/edição)
4. Testar Navbar (navegação, auth)
5. Testar TagFilter (filtro por tags)
6. Testar DeleteConfirmModal (confirmação)
7. Testar PrivateRoute e AdminRoute (proteção de rotas)
8. Testar AuthStatus (exibição de usuário)

**Critérios de Sucesso:**
- [ ] Todos os components renderizando corretamente
- [ ] Interações funcionando
- [ ] Props sendo passadas corretamente
- [ ] Zero erros no console
- [ ] Testes unitários passando

#### 7.7 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-7-components
git push origin develop
git checkout -b feature/ts-phase-8-pages
```

---

### FASE 8: Migração de Pages (2-3 horas)

#### 8.1 Ordem de Migração de Pages
1. `Login.jsx` → `Login.tsx`
2. `Register.jsx` → `Register.tsx`
3. `Dashboard.jsx` → `Dashboard.tsx`
4. `AdminPanel.jsx` → `AdminPanel.tsx`
5. `CreatePost.jsx` → `CreatePost.tsx`
6. `EditPost.jsx` → `EditPost.tsx`
7. `PostDetail.jsx` → `PostDetail.tsx`
8. `Home.jsx` → `Home.tsx`

#### 8.2 Validar Cada Page
```bash
npm run type-check
npm test -- src/pages/<page-name>.test.tsx
```

**Checkpoint 8:** Todas as pages migradas e testes passando

#### 8.3 Commit e Pull Request FASE 8
```bash
git add src/pages/
git commit -m "refactor(phase-8): migrar pages para TypeScript

- Migrar todas as pages para TypeScript
- Tipar hooks calls e event handlers
- Corrigir imports para usar tipos TypeScript
- Garantir tipagem correta de parâmetros de rota

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-8-pages
```

#### 8.4 Criar Pull Request
PR: `refactor(phase-8): Migrar pages para TypeScript`

#### 8.5 Testes Web Manuais - FASE 8
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Testar página Home (listagem de posts)
2. Testar página Login (fluxo de login)
3. Testar página Register (fluxo de registro)
4. Testar página Dashboard (dashboard do usuário)
5. Testar página AdminPanel (painel admin)
6. Testar página CreatePost (criação de post)
7. Testar página EditPost (edição de post)
8. Testar página PostDetail (detalhes do post)
9. Testar navegação entre todas as páginas
10. Testar parâmetros de rota (slug, id)

**Critérios de Sucesso:**
- [ ] Todas as pages renderizando corretamente
- [ ] Navegação funcionando
- [ ] Parâmetros de rota funcionando
- [ ] Zero erros no console
- [ ] Testes unitários passando

#### 8.6 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-8-pages
git push origin develop
git checkout -b feature/ts-phase-9-main
```

---

### FASE 9: Migração de Arquivos Principais (30 minutos)

#### 9.1 Migrar Main e App
1. Renomear `src/main.jsx` → `src/main.tsx`
2. Renomear `src/App.jsx` → `src/App.tsx`
3. Atualizar imports em `index.html` para usar `.tsx`

#### 9.2 Atualizar Index HTML
```html
<!-- Antes -->
<script type="module" src="/src/main.jsx"></script>

<!-- Depois -->
<script type="module" src="/src/main.tsx"></script>
```

**Checkpoint 9:** Arquivos principais migrados

#### 9.3 Commit e Pull Request FASE 9
```bash
git add src/main.tsx src/App.tsx index.html
git commit -m "refactor(phase-9): migrar arquivos principais para TypeScript

- Migrar main.jsx para main.tsx
- Migrar App.jsx para App.tsx
- Atualizar index.html para usar main.tsx
- Garantir ponto de entrada TypeScript funcionando

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-9-main
```

#### 9.4 Criar Pull Request
PR: `refactor(phase-9): Migrar arquivos principais para TypeScript`

#### 9.5 Testes Web Manuais - FASE 9
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Verificar se aplicação inicia corretamente
2. Testar todas as rotas principais
3. Verificar se não há erros de compilação
4. Testar hot-reload
5. Verificar console do navegador

**Critérios de Sucesso:**
- [ ] Aplicação inicia sem erros
- [ ] Todas as rotas funcionando
- [ ] Hot-reload funcional
- [ ] Zero erros no console
- [ ] Build funcionando

#### 9.6 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-9-main
git push origin develop
git checkout -b feature/ts-phase-10-tests
```

---

### FASE 10: Migração de Testes (2-3 horas)

#### 10.1 Migrar Setup de Testes
1. Renomear `src/test/setup.js` → `src/test/setup.ts`
2. Adicionar tipos para mocks do Firebase

#### 10.2 Migrar Todos os Arquivos de Teste
1. Renomear todos `.test.js` → `.test.ts`
2. Renomear todos `.test.jsx` → `.test.tsx`
3. Adicionar tipos onde necessário
4. Atualizar mocks para TypeScript

#### 10.3 Configurar Vitest para TypeScript
Atualizar `vitest.config.js`:
```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

**Checkpoint 10:** Todos os testes migrados

#### 10.4 Commit e Pull Request FASE 10
```bash
git add src/test/
git add **/*.test.ts
git add **/*.test.tsx
git commit -m "refactor(phase-10): migrar testes para TypeScript

- Migrar setup.js para setup.ts
- Migrar todos os testes .test.js para .test.ts
- Migrar todos os testes .test.jsx para .test.tsx
- Adicionar tipos para mocks e variáveis de teste
- Atualizar vitest.config.js para TypeScript

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-10-tests
```

#### 10.5 Criar Pull Request
PR: `refactor(phase-10): Migrar testes para TypeScript`

#### 10.6 Testes Web Manuais - FASE 10
```bash
npm install
npm test
npm run dev
```

**Validações Manuais:**
1. Executar todos os testes unitários
2. Verificar cobertura de testes
3. Testar aplicação no navegador
4. Verificar se mocks estão funcionando

**Critérios de Sucesso:**
- [ ] Todos os testes passando (100%)
- [ ] Cobertura de testes mantida
- [ ] Aplicação funcionando no navegador
- [ ] Zero erros no console
- [ ] Mocks do Firebase funcionando

#### 10.7 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-10-tests
git push origin develop
git checkout -b feature/ts-phase-11-validation
```

---

### FASE 11: Validação Final (1 hora)

#### 11.1 Executar Suite Completa de Validação
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Todos os testes
npm test

# Build
npm run build

# Dev server
npm run dev
```

#### 11.2 Verificar Manualmente
1. Abrir aplicação em navegador
2. Testar fluxo completo de autenticação
3. Testar criação/edição/deleção de posts
4. Testar filtragem por tags
5. Verificar console para erros

**Checkpoint 11:** Todas as validações passando

#### 11.3 Commit e Pull Request FASE 11
```bash
git add .
git commit -m "chore(phase-11): validação final TypeScript

- Executar validação completa (type-check, lint, test, build)
- Verificar funcionamento manual de todas as features
- Documentar resultado das validações

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-11-validation
```

#### 11.4 Criar Pull Request
PR: `chore(phase-11): Validação final TypeScript`

#### 11.5 Testes Web Manuais - FASE 11
```bash
npm install
npm run dev
```

**Validações Manuais Completas:**
1. Teste completo de autenticação (login, registro, logout)
2. Teste completo de CRUD de posts
3. Teste completo de navegação
4. Teste completo de filtragem por tags
5. Teste completo de rotas protegidas
6. Verificação de performance
7. Verificação de responsividade
8. Verificação de acessibilidade

**Critérios de Sucesso:**
- [ ] Type-check sem erros
- [ ] Lint sem erros
- [ ] Todos os testes passando
- [ ] Build funcionando
- [ ] Todas as features funcionando manualmente
- [ ] Zero erros no console
- [ ] Performance aceitável

#### 11.6 Merge e Preparação Próxima Fase
```bash
git checkout develop
git merge feature/ts-phase-11-validation
git push origin develop
git checkout -b feature/ts-phase-12-cleanup
```

---

### FASE 12: Limpeza e Refinamento (1 hora)

#### 12.1 Remover PropTypes
```bash
npm uninstall prop-types
```

#### 12.2 Remover Arquivos JS Antigos
Verificar se não há arquivos `.js` ou `.jsx` restantes em `src/`

#### 12.3 Atualizar .gitignore
Adicionar se necessário:
```
*.js
*.jsx
```

#### 12.4 Remover Comentários Desnecessários
Remover comentários JSDoc que agora são redundantes com tipos TypeScript

**Checkpoint 12:** Projeto limpo e apenas TypeScript

#### 12.5 Commit e Pull Request FASE 12
```bash
git add .
git commit -m "chore(phase-12): limpeza final pós-migração TypeScript

- Remover dependência prop-types
- Remover arquivos JS/JSX restantes
- Atualizar .gitignore
- Remover comentários JSDoc redundantes
- Verificar zero arquivos JavaScript em src/

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-12-cleanup
```

#### 12.6 Criar Pull Request
PR: `chore(phase-12): Limpeza final pós-migração TypeScript`

#### 12.7 Testes Web Manuais - FASE 12
```bash
npm install
npm run dev
```

**Validações Manuais:**
1. Verificar se aplicação ainda funciona após limpeza
2. Verificar se não há referências a PropTypes
3. Verificar se build funciona
4. Verificar se todos os testes passam

**Critérios de Sucesso:**
- [ ] Aplicação funcionando normalmente
- [ ] Zero referências a PropTypes
- [ ] Build funcionando
- [ ] Todos os testes passando
- [ ] Zero arquivos JS/JSX em src/

#### 12.8 Merge e Preparação Fase Final
```bash
git checkout develop
git merge feature/ts-phase-12-cleanup
git push origin develop
git checkout -b feature/ts-phase-13-final
```

---

### FASE 13: Documentação e Finalização (30 minutos)

#### 13.1 Atualizar Documentação
Atualizar README.md com:
- Informações sobre TypeScript
- Comandos de build com TypeScript
- Instruções de desenvolvimento

#### 13.2 Criar Resumo da Migração
Criar documento `MIGRATION_SUMMARY.md` com:
- Resumo das 13 fases executadas
- Benefícios obtidos
- Lições aprendidas
- Próximos passos

#### 13.3 Commit e Pull Request FASE 13
```bash
git add README.md MIGRATION_SUMMARY.md
git commit -m "docs(phase-13): documentação final da migração TypeScript

- Atualizar README com informações TypeScript
- Criar resumo da migração
- Documentar benefícios e lições aprendidas

Generated with [Devin](https://cli.devin.ai/docs)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>"

git push origin feature/ts-phase-13-final
```

#### 13.4 Criar Pull Request Final
PR: `docs(phase-13): Documentação final da migração TypeScript`

#### 13.5 Testes Web Manuais - FASE 13
```bash
npm install
npm run dev
```

**Validações Manuais Finais:**
1. Teste completo de todas as features
2. Verificar documentação atualizada
3. Verificar se README está correto
4. Teste de build de produção
5. Teste de deploy (se aplicável)

**Critérios de Sucesso:**
- [ ] Documentação completa e atualizada
- [ ] README refletindo stack TypeScript
- [ ] Todas as features funcionando
- [ ] Build de produção funcionando
- [ ] Projeto pronto para uso em produção

#### 13.6 Merge Final para Develop
```bash
# Após validação final e aprovação
git checkout develop
git merge feature/ts-phase-13-final
git push origin develop

# Opcional: Merge para main
git checkout main
git merge develop
git push origin main

# Limpar branches de feature
git branch -D feature-ts-phase-*
git push origin --delete feature-ts-phase-*
```

---

## Estratégia de Rollback

Se ocorrer problemas críticos:

```bash
# Voltar ao estado anterior
git checkout develop
git branch -D feature/typescript-migration

# Ou reverter commit específico
git revert <commit-hash>
```

## Critérios de Sucesso

- [ ] `npm run type-check` sem erros
- [ ] `npm run lint` sem erros
- [ ] `npm test` 100% passing
- [ ] `npm run build` sem erros
- [ ] Aplicação funciona corretamente em dev
- [ ] Zero arquivos JavaScript restantes em src/
- [ ] PropTypes removido do projeto
- [ ] Todos os tipos centralizados em `src/types/`

## Instruções para Agentes

### Execução Autônoma com PRs e Testes Web
1. Seguir as fases em ordem sequencial
2. Para cada fase:
   - Executar mudanças da fase
   - Commit das mudanças
   - Push para branch remoto
   - Criar Pull Request
   - Aguardar CI/CD passar
   - Executar testes web manuais
   - Validar funcionamento completo
   - Reportar resultados
   - Aguardar aprovação para merge
   - Merge para develop
   - Criar branch para próxima fase
3. Se um checkpoint falhar, não prosseguir até resolver
4. Documentar qualquer desvio do plano
5. Reportar progresso após cada fase

### Protocolo de Comunicação por Fase
**Início da Fase:** "Iniciando FASE X: [Nome da Fase]"
**Durante Fase:** Reportar progresso e qualquer bloqueio
**Pós-Commit:** "Commit realizado: [mensagem do commit]"
**Pós-PR:** "PR criado: [título do PR]"
**Pós-Testes Web:** "Testes web concluídos: [resultados]"
**Aguardando Aprovação:** "Aguardando aprovação do PR FASE X"
**Pós-Merge:** "FASE X mergeada para develop com sucesso"

### Tratamento de Erros
- Erros de tipo: Adicionar tipagem apropriada ou usar `any` temporariamente com comentário
- Erros de build: Verificar configuração do tsconfig
- Erros de teste: Atualizar mocks ou assertions para TypeScript
- Erros de runtime: Verificar se tipos correspondem à realidade em runtime
- Erros em testes web: Investigar funcionalidade específica, reportar para decisão

### Rollback por Fase
Se qualquer fase apresentar problemas críticos:
```bash
# Reverter merge da fase
git checkout develop
git revert <merge-commit-hash>

# Ou voltar ao estado antes da fase
git checkout develop
git reset --hard <commit-before-phase>
```

## Tempo Total Estimado

**Tempo de Execução Técnica:** 12-16 horas
**Tempo de Testes Web por Fase:** ~30-45 minutos × 13 fases = 6-10 horas
**Tempo de Revisão/Aprovação PRs:** Variável (depende de processo)
**TOTAL ESTIMADO:** 18-26 horas + tempo de aprovação PRs

**Nota:** O tempo adicional de testes web e aprovação de PRs aumenta significativamente a segurança do processo, permitindo detecção precoce de problemas e facilitando rollback.
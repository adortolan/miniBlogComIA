# Checklist de Migração TypeScript - Para Agentes

## Status da Migração

Use este checklist para acompanhar o progresso da migração.

### Pré-Migração
- [ ] Branch `develop` atualizado
- [ ] Nova branch `feature/typescript-migration` criada
- [ ] Todos os testes passando em JavaScript
- [ ] Backup commit realizado

### FASE 1: Preparação e Configuração
- [ ] Dependências TypeScript instaladas
- [ ] `tsconfig.json` criado
- [ ] `tsconfig.node.json` criado
- [ ] `vite.config.js` → `vite.config.ts`
- [ ] `.eslintrc.cjs` atualizado
- [ ] `package.json` scripts atualizados
- [ ] Type-check executando (com erros esperados)
- [ ] Commit realizado

### FASE 2: Tipos Base
- [ ] `src/types/index.ts` criado com todas as interfaces
- [ ] `src/types/firebase.ts` criado
- [ ] Types reconhecidos pelo TypeScript
- [ ] Commit realizado

### FASE 3: Utils e Config
- [ ] `src/config/firebase.js` → `firebase.ts`
- [ ] `src/utils/formatDate.js` → `formatDate.ts`
- [ ] `src/utils/generateSlug.js` → `generateSlug.ts`
- [ ] Type-check passando para utils/config
- [ ] Testes de utils/config passando
- [ ] Commit realizado

### FASE 4: Services
- [ ] `src/services/postService.js` → `postService.ts`
- [ ] Type-check passando para services
- [ ] Testes de services passando
- [ ] Commit realizado

### FASE 5: Contexts
- [ ] `src/contexts/AuthContext.jsx` → `AuthContext.tsx`
- [ ] PropTypes removidos
- [ ] Type-check passando para contexts
- [ ] Testes de contexts passando
- [ ] Commit realizado

### FASE 6: Hooks
- [ ] `useLogin.js` → `useLogin.ts`
- [ ] `useRegister.js` → `useRegister.ts`
- [ ] `useLogout.js` → `useLogout.ts`
- [ ] `useUserRole.js` → `useUserRole.ts`
- [ ] `usePosts.js` → `usePosts.ts`
- [ ] `usePostsByTag.js` → `usePostsByTag.ts`
- [ ] `useCreatePost.js` → `useCreatePost.ts`
- [ ] `useUpdatePost.js` → `useUpdatePost.ts`
- [ ] `useDeletePost.js` → `useDeletePost.ts`
- [ ] Type-check passando para hooks
- [ ] Todos os testes de hooks passando
- [ ] Commit realizado

### FASE 7: Components
- [ ] `TagFilter.jsx` → `TagFilter.tsx`
- [ ] `DeleteConfirmModal.jsx` → `DeleteConfirmModal.tsx`
- [ ] `AuthStatus.jsx` → `AuthStatus.tsx`
- [ ] `PrivateRoute.jsx` → `PrivateRoute.tsx`
- [ ] `AdminRoute.jsx` → `AdminRoute.tsx`
- [ ] `PostCard.jsx` → `PostCard.tsx`
- [ ] `PostForm.jsx` → `PostForm.tsx`
- [ ] `Navbar.jsx` → `Navbar.tsx`
- [ ] `HeroSection.jsx` → `HeroSection.tsx`
- [ ] `FirebaseTest.jsx` → `FirebaseTest.tsx` (se aplicável)
- [ ] Type-check passando para components
- [ ] Todos os testes de components passando
- [ ] Commit realizado

### FASE 8: Pages
- [ ] `Login.jsx` → `Login.tsx`
- [ ] `Register.jsx` → `Register.tsx`
- [ ] `Dashboard.jsx` → `Dashboard.tsx`
- [ ] `AdminPanel.jsx` → `AdminPanel.tsx`
- [ ] `CreatePost.jsx` → `CreatePost.tsx`
- [ ] `EditPost.jsx` → `EditPost.tsx`
- [ ] `PostDetail.jsx` → `PostDetail.tsx`
- [ ] `Home.jsx` → `Home.tsx`
- [ ] Type-check passando para pages
- [ ] Todos os testes de pages passando
- [ ] Commit realizado

### FASE 9: Arquivos Principais
- [ ] `src/main.jsx` → `main.tsx`
- [ ] `src/App.jsx` → `App.tsx`
- [ ] `index.html` atualizado
- [ ] Type-check passando
- [ ] Dev server funcionando
- [ ] Commit realizado

### FASE 10: Testes
- [ ] `src/test/setup.js` → `setup.ts`
- [ ] Todos os `.test.js` → `.test.ts`
- [ ] Todos os `.test.jsx` → `.test.tsx`
- [ ] `vitest.config.js` atualizado
- [ ] Todos os testes passando
- [ ] Commit realizado

### FASE 11: Limpeza Final
- [ ] PropTypes removido (npm uninstall prop-types)
- [ ] Zero arquivos `.js`/`.jsx` em `src/`
- [ ] Comentários JSDoc redundantes removidos
- [ ] Type-check passando
- [ ] Lint passando
- [ ] Todos os testes passando
- [ ] Build passando
- [ ] Aplicação funcionando manualmente
- [ ] Commit realizado

### FASE 12: Finalização
- [ ] Commit final com mensagem padrão
- [ ] Push para `origin/feature/typescript-migration`
- [ ] Pull Request criado
- [ ] Documentação atualizada (se necessário)

## Validações Finais

### Comandos de Validação
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testes
npm test

# Build
npm run build

# Verificar arquivos JS restantes
find src/ -name "*.js" -o -name "*.jsx"
```

### Critérios de Sucesso
- [ ] `npm run type-check` sem erros
- [ ] `npm run lint` sem erros
- [ ] `npm test` 100% passing
- [ ] `npm run build` sem erros
- [ ] Aplicação funciona em `npm run dev`
- [ ] Zero arquivos JavaScript restantes em src/
- [ ] PropTypes removido do package.json
- [ ] Todos os tipos centralizados em `src/types/`

## Log de Erros e Soluções

Use esta seção para documentar erros encontrados e soluções aplicadas.

| Fase | Erro | Solução | Status |
|------|------|---------|--------|
| | | | |
| | | | |
| | | | |

## Notas Adicionais

Espaço para anotações durante o processo de migração.

- 
- 
- 

## Tempo Gasto por Fase

| Fase | Tempo Estimado | Tempo Real | Observações |
|------|----------------|------------|-------------|
| FASE 1 | 30-45 min | | |
| FASE 2 | 1-2 horas | | |
| FASE 3 | 1 hora | | |
| FASE 4 | 1-2 horas | | |
| FASE 5 | 1 hora | | |
| FASE 6 | 2-3 horas | | |
| FASE 7 | 3-4 horas | | |
| FASE 8 | 2-3 horas | | |
| FASE 9 | 30 min | | |
| FASE 10 | 2-3 horas | | |
| FASE 11 | 1 hora | | |
| FASE 12 | 30 min | | |
| **TOTAL** | **12-16 horas** | | |
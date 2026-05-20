# Checklist de Migração TypeScript - Para Agentes

## Status da Migração

Use este checklist para acompanhar o progresso da migração.

### Pré-Migração
- [ ] Branch `develop` atualizado
- [ ] Nova branch `feature/typescript-migration` criada
- [ ] Todos os testes passando em JavaScript
- [ ] Backup commit realizado

### FASE 1: Preparação e Configuração
- [x] Dependências TypeScript instaladas
- [x] `tsconfig.json` criado
- [x] `tsconfig.node.json` criado
- [x] `vite.config.js` → `vite.config.ts`
- [x] `.eslintrc.cjs` atualizado
- [x] `package.json` scripts atualizados
- [x] Type-check executando (com erros esperados)
- [x] Commit realizado

### FASE 2: Tipos Base
- [x] `src/types/index.ts` criado com todas as interfaces
- [x] `src/types/firebase.ts` criado
- [x] Types reconhecidos pelo TypeScript
- [x] Commit realizado

### FASE 3: Utils e Config
- [x] `src/config/firebase.js` → `firebase.ts`
- [x] `src/utils/formatDate.js` → `formatDate.ts`
- [x] `src/utils/generateSlug.js` → `generateSlug.ts`
- [x] Type-check passando para utils/config
- [x] Testes de utils/config passando
- [x] Commit realizado

### FASE 4: Services
- [x] `src/services/postService.js` → `postService.ts`
- [x] Type-check passando para services
- [x] Testes de services passando
- [x] Commit realizado

### FASE 5: Contexts
- [x] `src/contexts/AuthContext.jsx` → `AuthContext.tsx`
- [x] PropTypes removidos
- [x] Type-check passando para contexts
- [x] Testes de contexts passando
- [x] Commit realizado

### FASE 6: Hooks
- [x] `useLogin.js` → `useLogin.ts`
- [x] `useRegister.js` → `useRegister.ts`
- [x] `useLogout.js` → `useLogout.ts`
- [x] `useUserRole.js` → `useUserRole.ts`
- [x] `usePosts.js` → `usePosts.ts`
- [x] `usePostsByTag.js` → `usePostsByTag.ts`
- [x] `useCreatePost.js` → `useCreatePost.ts`
- [x] `useUpdatePost.js` → `useUpdatePost.ts`
- [x] `useDeletePost.js` → `useDeletePost.ts`
- [x] Type-check passando para hooks
- [x] Todos os testes de hooks passando
- [x] Commit realizado

### FASE 7: Components
- [x] `TagFilter.jsx` → `TagFilter.tsx`
- [x] `DeleteConfirmModal.jsx` → `DeleteConfirmModal.tsx`
- [x] `AuthStatus.jsx` → `AuthStatus.tsx`
- [x] `PrivateRoute.jsx` → `PrivateRoute.tsx`
- [x] `AdminRoute.jsx` → `AdminRoute.tsx`
- [x] `PostCard.jsx` → `PostCard.tsx`
- [x] `PostForm.jsx` → `PostForm.tsx`
- [x] `Navbar.jsx` → `Navbar.tsx`
- [x] `HeroSection.jsx` → `HeroSection.tsx`
- [x] `FirebaseTest.jsx` → `FirebaseTest.tsx` (se aplicável)
- [x] Type-check passando para components
- [x] Todos os testes de components passando
- [x] Commit realizado

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
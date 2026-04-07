# 2.1 AuthContext

## Descrição
Criar o contexto de autenticação global para gerenciar o estado do usuário logado em toda a aplicação.

## Dependências
- 1.1 Setup do Projeto
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Criar AuthContext
- Criar `src/contexts/AuthContext.jsx`
- Definir `AuthContext` com `createContext()`
- Estado gerenciado: `user`, `loading`

### Etapa 2 — Criar AuthProvider
- Implementar componente `AuthProvider` que envolve a aplicação
- Usar `onAuthStateChanged` do Firebase para escutar mudanças no estado de autenticação
- Atualizar `user` quando o estado mudar
- Gerenciar `loading` enquanto verifica o estado inicial

### Etapa 3 — Expor valores do contexto
- Disponibilizar via `value` do Provider:
  - `user` — objeto do usuário logado ou `null`
  - `loading` — boolean indicando se está verificando autenticação
  - `isAuthenticated` — boolean derivado de `!!user`

### Etapa 4 — Envolver App com AuthProvider
- Em `src/main.jsx` ou `src/App.jsx`, envolver a árvore de componentes com `<AuthProvider>`

### Etapa 5 — Criar hook useAuthContext
- Criar hook auxiliar para consumir o contexto: `useAuthContext()`
- Incluir validação para garantir uso dentro do Provider

## Critérios de Aceite
- [ ] `AuthProvider` envolve toda a aplicação
- [ ] Estado `user` reflete corretamente o usuário logado/deslogado
- [ ] `loading` é `true` durante verificação inicial e `false` após
- [ ] `useAuthContext()` retorna `user`, `loading` e `isAuthenticated`
- [ ] Erro é lançado se `useAuthContext` for usado fora do Provider

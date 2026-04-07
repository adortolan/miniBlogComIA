# 5.1 useAuth

## Descrição
Criar hook customizado que encapsula toda a lógica de autenticação do Firebase.

## Dependências
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Criar hook useAuth
- Criar `src/hooks/useAuth.js`
- Importar `auth` de `src/config/firebase.js`

### Etapa 2 — Implementar método login
- `loginWithGoogle()`: login via `signInWithPopup` com `GoogleAuthProvider`
- `loginWithEmail(email, password)`: login via `signInWithEmailAndPassword`
- Retornar resultado ou lançar erro tratado

### Etapa 3 — Implementar método register
- `register(email, password, displayName)`:
  - Criar usuário com `createUserWithEmailAndPassword`
  - Atualizar `displayName` com `updateProfile`
  - Criar documento na coleção `users` do Firestore
- Retornar resultado ou lançar erro tratado

### Etapa 4 — Implementar método logout
- `logout()`: chamar `signOut(auth)`

### Etapa 5 — Gerenciar estado
- Estado interno: `error`, `loading`
- Resetar `error` a cada nova operação
- `loading` ativo durante operações assíncronas

### Etapa 6 — Retornar interface do hook
- Retornar: `{ loginWithGoogle, loginWithEmail, register, logout, error, loading }`

## Critérios de Aceite
- [ ] `loginWithGoogle()` autentica via popup do Google
- [ ] `loginWithEmail()` autentica com email e senha
- [ ] `register()` cria usuário e documento no Firestore
- [ ] `logout()` desloga o usuário
- [ ] `loading` reflete estado de operações em andamento
- [ ] `error` contém mensagem de erro quando operação falha

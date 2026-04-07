# 7.2 authService

## Descrição
Implementar camada de serviço para operações de autenticação com Firebase Auth.

## Dependências
- 1.2 Configuração do Firebase

## Etapas

### Etapa 1 — Criar arquivo de serviço
- Criar `src/services/authService.js`
- Importar `auth` de `src/config/firebase.js`
- Importar métodos: `signInWithPopup`, `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `updateProfile`, `GoogleAuthProvider`

### Etapa 2 — loginWithGoogle()
- Criar instância de `GoogleAuthProvider`
- Chamar `signInWithPopup(auth, provider)`
- Retornar objeto `user` do resultado

### Etapa 3 — loginWithEmail(email, password)
- Chamar `signInWithEmailAndPassword(auth, email, password)`
- Retornar objeto `user` do resultado

### Etapa 4 — registerWithEmail(email, password, displayName)
- Chamar `createUserWithEmailAndPassword(auth, email, password)`
- Atualizar perfil com `updateProfile(user, { displayName })`
- Retornar objeto `user`

### Etapa 5 — logout()
- Chamar `signOut(auth)`

### Etapa 6 — getCurrentUser()
- Retornar `auth.currentUser`

## Critérios de Aceite
- [ ] `loginWithGoogle()` abre popup e retorna usuário autenticado
- [ ] `loginWithEmail()` autentica com credenciais e retorna usuário
- [ ] `registerWithEmail()` cria conta e atualiza displayName
- [ ] `logout()` encerra sessão
- [ ] `getCurrentUser()` retorna usuário atual ou `null`
- [ ] Erros do Firebase são propagados corretamente

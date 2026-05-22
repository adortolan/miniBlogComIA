# 002 - Fluxo de Autenticação

**Tags:** auth, firebase, flow  
**Criado:** 2026-05-22

## Visão Geral

O sistema de autenticação usa Firebase Authentication com dois métodos:
- **Email/Senha** (registro + login)
- **Google OAuth** (popup)

## Provider Global

`src/contexts/AuthContext.tsx` envolve toda a app (em `main.tsx`).

- Escuta `onAuthStateChanged` do Firebase
- Expõe: `{ user: FirebaseUser | null, loading: boolean, isAuthenticated: boolean }`
- Hook de acesso: `useAuth()` ou `useAuthContext()`

## Fluxo de Registro

```
Register Page → useRegister hook
  1. Validação local (nome, email, senha 6+ chars)
  2. createUserWithEmailAndPassword(auth, email, password)
  3. updateProfile(user, { displayName })
  4. setDoc(db/users/{uid}, { displayName, email, photoURL:'', role:'reader', createdAt })
  5. Se falhar no perfil → deleta o user criado (rollback)
```

**Gotcha:** O registro cria automaticamente um documento em `users/{uid}` com role `reader`.

## Fluxo de Login (Email/Senha)

```
Login Page → useLogin.loginWithEmailAndPassword
  1. Validação local (email e senha não vazios)
  2. signInWithEmailAndPassword(auth, email, password)
  3. AuthContext detecta mudança via onAuthStateChanged
```

## Fluxo de Login (Google)

```
Login Page → useLogin.loginWithGoogle
  1. signInWithPopup(auth, GoogleAuthProvider)
  2. Verifica se doc users/{uid} existe
  3. Se NÃO existe → cria com { displayName, email, photoURL, role:'reader' }
  4. Se existe → não faz nada (mantém role atual)
```

**Gotcha:** Login Google nunca sobrescreve role existente. Permite que admin promova antes.

## Fluxo de Logout

```
Navbar/qualquer → useLogout
  1. signOut(auth)
  2. AuthContext detecta → user = null
  3. Navega para "/" (feito manualmente no Navbar)
```

## Sistema de Roles

- **reader** (default): pode criar posts, ver dashboard
- **admin**: acesso ao painel administrativo, pode editar/excluir qualquer post

Role é armazenada em `Firestore users/{uid}.role` e verificada por:
- `useUserRole(userId)` → hook genérico
- `AdminRoute` → guard que consulta Firestore diretamente

## Proteção de Rotas

- `PrivateRoute`: verifica `isAuthenticated` via context → redireciona para `/login`
- `AdminRoute`: verifica auth + consulta `users/{uid}.role === 'admin'` no Firestore

## Referências

- `src/contexts/AuthContext.tsx`: Provider e hooks
- `src/hooks/useLogin.ts`: Login email/Google
- `src/hooks/useRegister.ts`: Registro com perfil
- `src/hooks/useLogout.ts`: Logout
- `src/hooks/useUserRole.ts`: Consulta role
- `src/components/PrivateRoute.tsx`: Guard autenticação
- `src/components/AdminRoute.tsx`: Guard admin

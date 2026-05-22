# Verificações de Segurança Específicas para Firebase

Este documento contém checks de segurança específicos para aplicações que utilizam Firebase.

## Firestore Security Rules

### Regras Críticas a Verificar

#### 1. Regras Abertas (CRÍTICO)

```javascript
// ❌ NUNCA use isso em produção
match /{document=**} {
  allow read, write: if true;
}

// ❌ Também perigoso
match /{document=**} {
  allow read, write: if request.auth != null;
  // Qualquer usuário autenticado pode ler/escrever TUDO
}
```

#### 2. Padrão Seguro para Posts

```javascript
// ✅ Padrão recomendado
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Posts
    match /posts/{postId} {
      // Qualquer um pode ler posts publicados
      allow read: if resource.data.published == true 
                  || request.auth.uid == resource.data.authorId;
      
      // Apenas usuários autenticados podem criar
      allow create: if request.auth != null
                    && request.resource.data.authorId == request.auth.uid
                    && validatePost(request.resource.data);
      
      // Apenas o autor pode editar/deletar
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.authorId;
    }
    
    // Função de validação
    function validatePost(post) {
      return post.title is string
             && post.title.size() > 0
             && post.title.size() <= 200
             && post.content is string
             && post.createdAt == request.time;
    }
  }
}
```

#### 3. Validação de Dados nas Rules

```javascript
// ✅ Validar tipos e tamanhos
function validateUserData(data) {
  return data.keys().hasAll(['name', 'email'])
         && data.name is string
         && data.name.size() >= 2
         && data.name.size() <= 100
         && data.email is string
         && data.email.matches('.*@.*\\..*');
}
```

### Checklist de Firestore Rules

- [ ] Não há `allow read, write: if true` em nenhuma collection
- [ ] Cada collection tem regras específicas
- [ ] Criação de documentos valida ownership (authorId == auth.uid)
- [ ] Update/Delete verificam ownership
- [ ] Dados são validados (tipos, tamanhos, campos obrigatórios)
- [ ] Não há acesso a collections administrativas por usuários comuns
- [ ] Timestamps são validados (request.time)

---

## Firebase Authentication

### Configurações a Verificar

#### 1. Providers Habilitados

```typescript
// Verificar quais providers estão ativos
// No Firebase Console: Authentication > Sign-in method

// Providers comuns:
// - Email/Password
// - Google
// - GitHub
// - Anonymous (cuidado!)
```

#### 2. Política de Senhas

```typescript
// Firebase tem política mínima por padrão (6 caracteres)
// Considere adicionar validação extra no frontend

const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true
};

function validatePassword(password: string): boolean {
  if (password.length < passwordRequirements.minLength) return false;
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) return false;
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) return false;
  if (passwordRequirements.requireNumber && !/[0-9]/.test(password)) return false;
  if (passwordRequirements.requireSpecialChar && !/[!@#$%^&*]/.test(password)) return false;
  return true;
}
```

#### 3. Domínios Autorizados

```
// Firebase Console: Authentication > Settings > Authorized domains
// Verificar se apenas domínios legítimos estão listados
// Remover localhost em produção (ou manter apenas para dev)
```

#### 4. Email Enumeration Protection

```typescript
// Firebase pode revelar se um email existe
// Habilitar proteção no Console:
// Authentication > Settings > User account linking
// "Prevent email enumeration" = ON
```

### Checklist de Authentication

- [ ] Apenas providers necessários estão habilitados
- [ ] Anonymous auth desabilitado (se não necessário)
- [ ] Política de senha adequada
- [ ] Domínios autorizados revisados
- [ ] Email enumeration protection habilitado
- [ ] Email verification configurado
- [ ] Password reset configurado corretamente

---

## Firebase Storage

### Security Rules para Storage

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Imagens de perfil
    match /users/{userId}/profile/{fileName} {
      // Apenas o próprio usuário pode fazer upload
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // 5MB
                   && request.resource.contentType.matches('image/.*');
      
      // Qualquer um pode ver
      allow read: if true;
    }
    
    // Imagens de posts
    match /posts/{postId}/{fileName} {
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024  // 10MB
                   && request.resource.contentType.matches('image/.*');
      
      allow read: if true;
    }
    
    // Bloquear todo o resto
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### Checklist de Storage

- [ ] Regras não permitem upload irrestrito
- [ ] Tamanho máximo de arquivo definido
- [ ] Tipos de arquivo (contentType) validados
- [ ] Paths de upload validam ownership
- [ ] Não há regras `allow write: if true`

---

## Firebase Config no Frontend

### O que é Seguro Expor

```typescript
// ✅ Estas configurações PODEM estar no frontend
// Elas são públicas por design
const firebaseConfig = {
  apiKey: "AIza...",           // Público - identificador do projeto
  authDomain: "xxx.firebaseapp.com",
  projectId: "my-project",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

// A segurança vem das Security Rules, não do sigilo da config
```

### O que NUNCA Expor

```typescript
// ❌ NUNCA coloque no frontend
const adminConfig = {
  serviceAccountKey: "...",    // Acesso admin completo
  databaseURL: "...",          // Se usar Realtime Database
  privateKey: "..."            // Qualquer chave privada
};
```

### Verificações de Config

```bash
# Buscar possíveis vazamentos de service account
grep -rn "private_key\|service_account\|-----BEGIN" --include="*.ts" --include="*.js" --include="*.json"

# Verificar .gitignore
cat .gitignore | grep -i "service\|key\|secret"
```

---

## Cloud Functions (se aplicável)

### Segurança em Functions

```typescript
// ✅ Validar autenticação
export const secureFunction = functions.https.onCall(async (data, context) => {
  // Verificar se está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  // Verificar permissões
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Must be admin');
  }
  
  // Validar input
  if (!data.requiredField || typeof data.requiredField !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid input');
  }
  
  // Processar...
});
```

### Checklist de Cloud Functions

- [ ] Todas as functions verificam autenticação
- [ ] Inputs são validados
- [ ] Erros não expõem informações sensíveis
- [ ] Secrets estão em environment variables
- [ ] Rate limiting implementado (se necessário)
- [ ] Logs não contêm dados sensíveis

---

## Variáveis de Ambiente

### Padrão Recomendado

```bash
# .env.local (NÃO commitar)
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# .env.example (commitar como template)
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain-here
# ...
```

### Verificações

```bash
# Verificar se .env está no .gitignore
grep "\.env" .gitignore

# Verificar se há .env commitado
git ls-files | grep "\.env"

# Buscar hardcoded values
grep -rn "AIza\|firebaseapp.com" --include="*.ts" --include="*.tsx" | grep -v "node_modules"
```

---

## Monitoramento e Logging

### Firebase Analytics

```typescript
// ✅ Logar eventos de segurança
import { logEvent } from 'firebase/analytics';

// Login bem-sucedido
logEvent(analytics, 'login', { method: 'email' });

// Tentativa de acesso não autorizado
logEvent(analytics, 'unauthorized_access_attempt', {
  path: window.location.pathname,
  userId: user?.uid || 'anonymous'
});
```

### Firebase Crashlytics

```typescript
// ✅ Capturar erros de segurança
import { recordError } from 'firebase/crashlytics';

try {
  await sensitiveOperation();
} catch (error) {
  recordError(error, {
    context: 'sensitive_operation',
    userId: user?.uid
  });
  throw error;
}
```

---

## Resumo de Comandos de Verificação

```bash
# 1. Verificar Firestore Rules
cat firestore.rules

# 2. Verificar Storage Rules
cat storage.rules

# 3. Buscar config hardcoded
grep -rn "apiKey\|authDomain\|projectId" --include="*.ts" --include="*.tsx"

# 4. Verificar .env files
ls -la .env* 2>/dev/null
cat .gitignore | grep env

# 5. Buscar service account keys
grep -rn "private_key\|service_account" --include="*.json" --include="*.ts"

# 6. Verificar imports de admin SDK no frontend
grep -rn "firebase-admin\|admin.firestore\|admin.auth" --include="*.ts" --include="*.tsx"
```

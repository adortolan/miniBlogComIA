# OWASP Top 10 - Checks Detalhados

Este documento contém os padrões de verificação detalhados para cada categoria do OWASP Top 10 (2021).

## A01:2021 - Broken Access Control

### O que verificar

1. **Controle de Acesso no Frontend vs Backend**
   - Verificações de permissão DEVEM estar no backend
   - Frontend pode ocultar elementos, mas não é controle de acesso
   - Firestore Security Rules são o controle real para Firebase

2. **Insecure Direct Object Reference (IDOR)**
   ```typescript
   // VULNERÁVEL: ID vem direto do usuário sem verificação
   const doc = await getDoc(doc(db, 'posts', req.params.id));
   
   // SEGURO: Verifica ownership
   const docRef = doc(db, 'posts', req.params.id);
   const docSnap = await getDoc(docRef);
   if (docSnap.data().authorId !== currentUser.uid) {
     throw new Error('Unauthorized');
   }
   ```

3. **Firestore Security Rules**
   ```javascript
   // VULNERÁVEL
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;  // CRÍTICO!
       }
     }
   }
   
   // SEGURO
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /posts/{postId} {
         allow read: if true;
         allow create: if request.auth != null;
         allow update, delete: if request.auth != null 
           && request.auth.uid == resource.data.authorId;
       }
     }
   }
   ```

4. **Bypass de Rotas Protegidas**
   ```typescript
   // VULNERÁVEL: Apenas redireciona, não bloqueia dados
   useEffect(() => {
     if (!user) navigate('/login');
   }, [user]);
   // Componente ainda renderiza e pode fazer requests
   
   // SEGURO: Bloqueia renderização
   if (!user) {
     return <Navigate to="/login" />;
   }
   ```

### Padrões de Busca

```bash
# Buscar rotas sem proteção
grep -rn "Route\|path=" --include="*.tsx" --include="*.ts"

# Buscar acesso direto a documentos
grep -rn "getDoc\|getDocs\|setDoc\|updateDoc\|deleteDoc" --include="*.ts" --include="*.tsx"

# Verificar Firestore rules
cat firestore.rules
```

---

## A02:2021 - Cryptographic Failures

### O que verificar

1. **Secrets Expostos**
   ```typescript
   // VULNERÁVEL: API key no código
   const apiKey = "AIzaSyB1234567890abcdef";
   
   // SEGURO: Variável de ambiente
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

2. **Dados Sensíveis em LocalStorage**
   ```typescript
   // VULNERÁVEL: Token em localStorage (XSS pode roubar)
   localStorage.setItem('authToken', token);
   
   // MELHOR: HttpOnly cookies (quando possível)
   // Para Firebase, usar o SDK que gerencia tokens automaticamente
   ```

3. **Transmissão Insegura**
   ```typescript
   // VULNERÁVEL: HTTP
   fetch('http://api.example.com/data');
   
   // SEGURO: HTTPS
   fetch('https://api.example.com/data');
   ```

4. **Algoritmos Fracos**
   ```typescript
   // VULNERÁVEL: MD5/SHA1 para senhas
   const hash = md5(password);
   
   // SEGURO: bcrypt, Argon2, ou Firebase Auth (que usa scrypt)
   // Firebase Auth gerencia isso automaticamente
   ```

### Padrões de Busca

```bash
# Buscar possíveis secrets
grep -rn "apiKey\|API_KEY\|secret\|SECRET\|password\|PASSWORD" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env*"

# Buscar localStorage com dados sensíveis
grep -rn "localStorage.setItem\|sessionStorage.setItem" --include="*.ts" --include="*.tsx"

# Buscar HTTP (não HTTPS)
grep -rn "http://" --include="*.ts" --include="*.tsx" --include="*.js"

# Verificar .gitignore inclui .env
cat .gitignore | grep -i env
```

---

## A03:2021 - Injection

### O que verificar

1. **XSS via dangerouslySetInnerHTML**
   ```tsx
   // VULNERÁVEL: Conteúdo não sanitizado
   <div dangerouslySetInnerHTML={{ __html: userContent }} />
   
   // SEGURO: Sanitizar com DOMPurify
   import DOMPurify from 'dompurify';
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
   ```

2. **NoSQL Injection (Firestore)**
   ```typescript
   // VULNERÁVEL: Query construída com input do usuário
   const q = query(collection(db, userInput));
   
   // SEGURO: Validar e sanitizar input
   const allowedCollections = ['posts', 'comments'];
   if (!allowedCollections.includes(userInput)) {
     throw new Error('Invalid collection');
   }
   ```

3. **eval() e Function()**
   ```typescript
   // VULNERÁVEL: Execução de código arbitrário
   eval(userInput);
   new Function(userInput)();
   
   // NUNCA usar eval com dados externos
   ```

4. **Template Literals em URLs**
   ```typescript
   // VULNERÁVEL: URL injection
   window.location.href = `https://example.com/redirect?url=${userInput}`;
   
   // SEGURO: Validar contra whitelist
   const allowedUrls = ['https://example.com', 'https://app.example.com'];
   if (!allowedUrls.some(url => userInput.startsWith(url))) {
     throw new Error('Invalid redirect URL');
   }
   ```

### Padrões de Busca

```bash
# Buscar dangerouslySetInnerHTML
grep -rn "dangerouslySetInnerHTML" --include="*.tsx" --include="*.jsx"

# Buscar eval e Function
grep -rn "eval(\|new Function(" --include="*.ts" --include="*.tsx" --include="*.js"

# Buscar innerHTML
grep -rn "\.innerHTML\s*=" --include="*.ts" --include="*.tsx" --include="*.js"
```

---

## A04:2021 - Insecure Design

### O que verificar

1. **Rate Limiting**
   ```typescript
   // VULNERÁVEL: Sem limite de tentativas
   async function login(email, password) {
     return signInWithEmailAndPassword(auth, email, password);
   }
   
   // SEGURO: Implementar rate limiting
   // Firebase Auth tem proteção built-in, mas verificar configuração
   ```

2. **Validação de Negócio**
   ```typescript
   // VULNERÁVEL: Sem validação de quantidade
   async function purchase(itemId, quantity) {
     // Permite quantidade negativa?
     await processOrder(itemId, quantity);
   }
   
   // SEGURO: Validar regras de negócio
   async function purchase(itemId, quantity) {
     if (quantity <= 0 || quantity > 100) {
       throw new Error('Invalid quantity');
     }
     await processOrder(itemId, quantity);
   }
   ```

3. **Princípio do Menor Privilégio**
   ```typescript
   // VULNERÁVEL: Usuário comum com permissões de admin
   const userRoles = ['user', 'admin']; // Por padrão
   
   // SEGURO: Apenas permissões necessárias
   const userRoles = ['user']; // Admin atribuído explicitamente
   ```

### Padrões de Busca

```bash
# Buscar funções de autenticação
grep -rn "signIn\|login\|authenticate" --include="*.ts" --include="*.tsx"

# Buscar validações
grep -rn "if.*<\|if.*>\|validate\|isValid" --include="*.ts" --include="*.tsx"
```

---

## A05:2021 - Security Misconfiguration

### O que verificar

1. **CORS Permissivo**
   ```typescript
   // VULNERÁVEL: Permite qualquer origem
   app.use(cors({ origin: '*' }));
   
   // SEGURO: Whitelist de origens
   app.use(cors({ 
     origin: ['https://myapp.com', 'https://staging.myapp.com']
   }));
   ```

2. **Headers de Segurança**
   ```html
   <!-- Verificar se existem no index.html ou servidor -->
   Content-Security-Policy
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   Strict-Transport-Security
   ```

3. **Debug em Produção**
   ```typescript
   // VULNERÁVEL: Console.log em produção
   console.log('User data:', userData);
   
   // SEGURO: Remover ou condicionar
   if (import.meta.env.DEV) {
     console.log('User data:', userData);
   }
   ```

4. **Firebase Config Exposta**
   ```typescript
   // INFO: Firebase config no frontend é esperado
   // MAS: Verificar se Firestore Rules estão configuradas
   // A segurança vem das Rules, não do sigilo da config
   ```

### Padrões de Busca

```bash
# Buscar CORS
grep -rn "cors\|Access-Control" --include="*.ts" --include="*.js"

# Buscar console.log
grep -rn "console.log\|console.error\|console.warn" --include="*.ts" --include="*.tsx"

# Verificar variáveis de ambiente
cat .env* 2>/dev/null
```

---

## A06:2021 - Vulnerable and Outdated Components

### O que verificar

1. **Dependências com Vulnerabilidades**
   ```bash
   # Executar audit
   npm audit
   yarn audit
   
   # Verificar severidade
   npm audit --audit-level=high
   ```

2. **Versões Desatualizadas**
   ```bash
   # Verificar updates disponíveis
   npm outdated
   yarn outdated
   ```

3. **Dependências Abandonadas**
   - Verificar última atualização no npm
   - Verificar issues abertas no GitHub
   - Verificar se há alternativas mantidas

### Padrões de Busca

```bash
# Verificar package.json
cat package.json | grep -A 100 "dependencies"

# Executar audit
npm audit --json

# Verificar lock file
cat package-lock.json | head -100
```

---

## A07:2021 - Identification and Authentication Failures

### O que verificar

1. **Política de Senhas**
   ```typescript
   // VULNERÁVEL: Aceita qualquer senha
   if (password.length > 0) { ... }
   
   // SEGURO: Requisitos mínimos
   if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
     throw new Error('Password too weak');
   }
   ```

2. **Expiração de Tokens**
   ```typescript
   // Firebase Auth gerencia tokens automaticamente
   // Verificar se não há tokens custom sem expiração
   ```

3. **Proteção contra Brute Force**
   ```typescript
   // Firebase Auth tem proteção built-in
   // Verificar se está habilitada no console
   ```

4. **Session Management**
   ```typescript
   // VULNERÁVEL: Session não invalidada no logout
   function logout() {
     navigate('/login');
   }
   
   // SEGURO: Invalidar session
   async function logout() {
     await signOut(auth);
     navigate('/login');
   }
   ```

### Padrões de Busca

```bash
# Buscar validação de senha
grep -rn "password\|senha" --include="*.ts" --include="*.tsx"

# Buscar logout
grep -rn "logout\|signOut" --include="*.ts" --include="*.tsx"

# Buscar token handling
grep -rn "token\|jwt\|session" --include="*.ts" --include="*.tsx"
```

---

## A08:2021 - Software and Data Integrity Failures

### O que verificar

1. **Dependências de Fontes Não Confiáveis**
   ```json
   // VULNERÁVEL: Pacote de fonte desconhecida
   "dependencies": {
     "random-package-xyz": "^1.0.0"
   }
   
   // SEGURO: Pacotes conhecidos e verificados
   ```

2. **Integridade de CDN**
   ```html
   <!-- VULNERÁVEL: Sem integrity check -->
   <script src="https://cdn.example.com/lib.js"></script>
   
   <!-- SEGURO: Com SRI -->
   <script src="https://cdn.example.com/lib.js" 
           integrity="sha384-..." 
           crossorigin="anonymous"></script>
   ```

3. **CI/CD Security**
   - Verificar se secrets estão em variáveis de ambiente
   - Verificar se há code review obrigatório
   - Verificar se há scanning de vulnerabilidades

### Padrões de Busca

```bash
# Verificar scripts externos
grep -rn "<script src=" --include="*.html"

# Verificar package.json
cat package.json

# Verificar CI/CD
cat .github/workflows/*.yml 2>/dev/null
```

---

## A09:2021 - Security Logging and Monitoring Failures

### O que verificar

1. **Logs de Eventos de Segurança**
   ```typescript
   // VULNERÁVEL: Falha de login não logada
   try {
     await signIn(email, password);
   } catch (e) {
     setError('Login failed');
   }
   
   // SEGURO: Logar eventos de segurança
   try {
     await signIn(email, password);
     logger.info('Login successful', { userId: user.uid });
   } catch (e) {
     logger.warn('Login failed', { email, error: e.code });
     setError('Login failed');
   }
   ```

2. **Dados Sensíveis em Logs**
   ```typescript
   // VULNERÁVEL: Senha em log
   console.log('Login attempt:', { email, password });
   
   // SEGURO: Sem dados sensíveis
   console.log('Login attempt:', { email });
   ```

3. **Monitoramento de Anomalias**
   - Verificar se há alertas configurados
   - Verificar se há dashboard de segurança
   - Firebase oferece Analytics e Crashlytics

### Padrões de Busca

```bash
# Buscar logging
grep -rn "console.log\|logger\|log(" --include="*.ts" --include="*.tsx"

# Verificar se há serviço de logging
grep -rn "sentry\|datadog\|newrelic\|crashlytics" --include="*.ts" --include="*.tsx" --include="package.json"
```

---

## A10:2021 - Server-Side Request Forgery (SSRF)

### O que verificar

1. **Fetch com URL do Usuário**
   ```typescript
   // VULNERÁVEL: URL controlada pelo usuário
   const response = await fetch(userProvidedUrl);
   
   // SEGURO: Validar contra whitelist
   const allowedDomains = ['api.example.com', 'cdn.example.com'];
   const url = new URL(userProvidedUrl);
   if (!allowedDomains.includes(url.hostname)) {
     throw new Error('Domain not allowed');
   }
   ```

2. **Redirecionamentos**
   ```typescript
   // VULNERÁVEL: Redirect aberto
   window.location.href = req.query.redirect;
   
   // SEGURO: Validar destino
   const allowedRedirects = ['/dashboard', '/profile', '/settings'];
   if (!allowedRedirects.includes(req.query.redirect)) {
     throw new Error('Invalid redirect');
   }
   ```

3. **Importação de Recursos**
   ```typescript
   // VULNERÁVEL: Imagem de qualquer URL
   <img src={userProvidedImageUrl} />
   
   // SEGURO: Proxy ou whitelist
   // Usar Firebase Storage ou CDN próprio
   ```

### Padrões de Busca

```bash
# Buscar fetch/axios com variáveis
grep -rn "fetch(\|axios\.\|http.get\|http.post" --include="*.ts" --include="*.tsx"

# Buscar redirects
grep -rn "redirect\|location.href\|navigate(" --include="*.ts" --include="*.tsx"

# Buscar img src dinâmico
grep -rn "src={" --include="*.tsx"
```

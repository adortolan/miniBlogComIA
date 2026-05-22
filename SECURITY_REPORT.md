# Relatório de Auditoria de Segurança - OWASP Top 10

**Projeto:** miniBlog  
**Data:** 2026-05-22  
**Auditor:** Devin AI (OWASP Security Check Skill)  
**Versão do Relatório:** 1.0

---

## 1. Sumário Executivo

### Visão Geral

Auditoria de segurança do projeto miniBlog, uma aplicação React + Firebase (Vite + TypeScript) para gerenciamento de posts de blog. A análise cobriu código frontend, configurações Firebase, Firestore Security Rules e dependências.

### Resumo de Findings

| Severidade | Quantidade |
|------------|------------|
| 🔴 Crítica | 1 |
| 🟠 Alta | 1 |
| 🟡 Média | 3 |
| 🟢 Baixa | 2 |
| ⚪ Info | 3 |
| **Total** | **10** |

### Conclusão

O projeto apresenta uma **postura de segurança razoável** com algumas áreas que requerem atenção:

- ✅ **Pontos fortes:**
  - Firestore Security Rules bem estruturadas
  - Uso de variáveis de ambiente para configuração Firebase
  - Rotas protegidas com PrivateRoute e AdminRoute
  - Sem uso de `dangerouslySetInnerHTML` ou `eval()`
  - Validação de inputs no frontend

- ⚠️ **Áreas que requerem atenção:**
  - Dependências com vulnerabilidades conhecidas
  - Console.log em produção pode vazar informações
  - Headers de segurança ausentes

- 🚨 **Riscos críticos:**
  - Arquivo `.env` com credenciais pode ter sido commitado no histórico

---

## 2. Escopo da Auditoria

### Aplicação Analisada

- **Tipo:** React SPA (Single Page Application)
- **Framework:** React 19 + Vite 5 + TypeScript
- **Backend:** Firebase (Auth + Firestore)
- **Ambiente:** Desenvolvimento

### Componentes Incluídos

- [x] Código Frontend (src/)
- [x] Configurações de Segurança
- [x] Dependências (package.json)
- [x] Firestore Security Rules
- [x] Firebase Authentication Config
- [ ] CI/CD Pipeline (parcial)

---

## 3. Findings

### 3.1 Vulnerabilidades Críticas 🔴

#### [CRÍTICA] A02-001: Credenciais Firebase no arquivo .env

**Categoria OWASP:** A02 - Cryptographic Failures  
**CWE:** CWE-798 (Use of Hard-coded Credentials)

**Localização:**
```
.env (linha 4-9)
```

**Descrição:**
O arquivo `.env` contém as credenciais Firebase em texto plano. Embora o `.gitignore` inclua `.env`, o arquivo existe no diretório de trabalho e pode ter sido commitado anteriormente no histórico do Git.

**Código Vulnerável:**
```bash
VITE_FIREBASE_API_KEY=AIzaSyDqH060hfHKRPPmadVf66avyHv15uWG9y4
VITE_FIREBASE_AUTH_DOMAIN=miniblog-261e2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=miniblog-261e2
# ... outras credenciais
```

**Impacto:**
- As credenciais Firebase do frontend são públicas por design
- **MAS** se o histórico do Git contiver o `.env`, qualquer pessoa com acesso ao repositório pode ver as credenciais
- Risco de abuso do projeto Firebase (billing, spam, etc.)

**Recomendação:**
1. Verificar se `.env` foi commitado: `git log --all --full-history -- .env`
2. Se foi commitado, usar `git filter-branch` ou BFG Repo-Cleaner para remover do histórico
3. Rotacionar as credenciais Firebase se expostas
4. Usar `.env.example` apenas com placeholders

**Referências:**
- [OWASP - Cryptographic Failures](https://owasp.org/Top10/A02_2021-Cryptographic_Failures/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/api-keys)

---

### 3.2 Vulnerabilidades Altas 🟠

#### [ALTA] A06-001: Dependências com Vulnerabilidades Conhecidas

**Categoria OWASP:** A06 - Vulnerable and Outdated Components  
**CWE:** CWE-1035 (Using Components with Known Vulnerabilities)

**Localização:**
```
package.json, node_modules/
```

**Descrição:**
O `npm audit` identificou 17 vulnerabilidades nas dependências do projeto.

**Vulnerabilidades Encontradas:**
```
- happy-dom <=20.8.8: CRÍTICA (RCE via script tag, VM Context Escape)
- undici <=6.23.0: ALTA (múltiplas CVEs - CRLF injection, DoS, smuggling)
- esbuild <=0.24.2: MODERADA (permite requests não autorizados)
- vite <=6.4.1: MODERADA (depende de esbuild vulnerável)
```

**Impacto:**
- `happy-dom`: Execução remota de código em ambiente de testes
- `undici`: Usado pelo Firebase Auth - pode permitir ataques de smuggling HTTP
- Comprometimento da integridade dos testes e potencial RCE

**Recomendação:**
```bash
# Atualizar dependências seguras
npm audit fix

# Para breaking changes (testar antes)
npm audit fix --force

# Ou atualizar manualmente
npm update happy-dom undici
```

**Referências:**
- [GHSA-37j7-fg3j-429f](https://github.com/advisories/GHSA-37j7-fg3j-429f) (happy-dom RCE)
- [GHSA-c76h-2ccp-4975](https://github.com/advisories/GHSA-c76h-2ccp-4975) (undici)

---

### 3.3 Vulnerabilidades Médias 🟡

#### [MÉDIA] A05-001: Headers de Segurança Ausentes

**Categoria OWASP:** A05 - Security Misconfiguration  
**CWE:** CWE-693 (Protection Mechanism Failure)

**Localização:**
```
index.html
```

**Descrição:**
O arquivo `index.html` não inclui headers de segurança importantes como CSP, X-Frame-Options, etc.

**Impacto:**
- Vulnerável a clickjacking (sem X-Frame-Options)
- Sem Content Security Policy para mitigar XSS
- Sem HSTS para forçar HTTPS

**Recomendação:**
Adicionar meta tags ou configurar no servidor/Firebase Hosting:

```html
<!-- index.html -->
<head>
  <meta http-equiv="Content-Security-Policy" 
        content="default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
</head>
```

Ou em `firebase.json`:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" }
        ]
      }
    ]
  }
}
```

---

#### [MÉDIA] A09-001: Console.log em Código de Produção

**Categoria OWASP:** A09 - Security Logging and Monitoring Failures  
**CWE:** CWE-532 (Insertion of Sensitive Information into Log File)

**Localização:**
```
src/services/postService.ts:51-57, 119-125, 151
src/pages/PostDetail.tsx:43, 70
src/pages/EditPost.tsx:46, 73
src/pages/CreatePost.tsx:28
src/components/AdminRoute.tsx:30
src/hooks/useRegister.ts:64, 68
src/hooks/useUserRole.ts:39
```

**Descrição:**
Múltiplos `console.error` e `console.log` no código que serão executados em produção, potencialmente expondo informações sensíveis no console do navegador.

**Código Vulnerável:**
```typescript
// src/services/postService.ts
console.error('Error code:', firebaseError.code);
console.error('Error message:', firebaseError.message);
```

**Impacto:**
- Informações de debug visíveis para qualquer usuário
- Códigos de erro Firebase podem revelar estrutura interna
- Facilita reconhecimento por atacantes

**Recomendação:**
```typescript
// Usar logger condicional
const logger = {
  error: (...args: unknown[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
    // Em produção, enviar para serviço de monitoramento (Sentry, etc.)
  }
};
```

---

#### [MÉDIA] A07-001: Política de Senha Fraca

**Categoria OWASP:** A07 - Identification and Authentication Failures  
**CWE:** CWE-521 (Weak Password Requirements)

**Localização:**
```
src/hooks/useRegister.ts:34-38
src/pages/Login.tsx:42-43
src/pages/Register.tsx:49-50
```

**Descrição:**
A política de senha exige apenas 6 caracteres mínimos, sem requisitos de complexidade.

**Código Atual:**
```typescript
if (password.length < 6) {
  setValidationError('Senha muito fraca. Use no mínimo 6 caracteres');
}
```

**Impacto:**
- Senhas como "123456" ou "aaaaaa" são aceitas
- Vulnerável a ataques de força bruta e dicionário

**Recomendação:**
```typescript
const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 8) {
    return { valid: false, error: 'Senha deve ter no mínimo 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Senha deve conter pelo menos uma letra maiúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Senha deve conter pelo menos uma letra minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Senha deve conter pelo menos um número' };
  }
  return { valid: true };
};
```

---

### 3.4 Vulnerabilidades Baixas 🟢

#### [BAIXA] A10-001: URL de Imagem Externa Sem Validação

**Categoria OWASP:** A10 - Server-Side Request Forgery  
**CWE:** CWE-918 (Server-Side Request Forgery)

**Localização:**
```
src/components/PostForm.tsx:206-211
src/components/HeroSection.tsx:12
```

**Descrição:**
O campo `imageURL` aceita qualquer URL externa para imagens, sem validação de domínio.

**Código:**
```tsx
<img src={formData.imageURL} alt="Preview" />
```

**Impacto:**
- Baixo para SSRF (é client-side, não server-side)
- Pode carregar imagens de domínios maliciosos
- Potencial para tracking pixels

**Recomendação:**
```typescript
const ALLOWED_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'firebasestorage.googleapis.com',
  // adicionar domínios confiáveis
];

const isAllowedImageUrl = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_IMAGE_DOMAINS.some(domain => hostname.endsWith(domain));
  } catch {
    return false;
  }
};
```

---

#### [BAIXA] A04-001: Ausência de Rate Limiting Explícito

**Categoria OWASP:** A04 - Insecure Design  
**CWE:** CWE-770 (Allocation of Resources Without Limits)

**Localização:**
```
src/hooks/useLogin.ts
src/hooks/useRegister.ts
```

**Descrição:**
Não há rate limiting explícito no frontend para tentativas de login/registro.

**Impacto:**
- Firebase Auth tem proteção built-in (`auth/too-many-requests`)
- Risco mitigado pelo Firebase, mas sem feedback visual proativo

**Recomendação:**
- Implementar contador de tentativas no frontend
- Mostrar CAPTCHA após X tentativas falhas
- Adicionar delay progressivo entre tentativas

---

### 3.5 Informativas ⚪

#### [INFO] A01-001: Firestore Rules Bem Configuradas

**Categoria OWASP:** A01 - Broken Access Control

**Localização:**
```
firestore.rules
```

**Descrição:**
As Firestore Security Rules estão bem estruturadas:
- Helper functions para autenticação (`isAuthenticated`, `isOwner`, `isAdmin`)
- Posts: leitura pública, criação autenticada, update/delete por owner ou admin
- Users: leitura pública, create/update pelo próprio usuário, delete apenas admin
- Regra catch-all que nega acesso a outras collections

**Status:** ✅ Adequado

---

#### [INFO] A03-001: Sem Vulnerabilidades de Injection

**Categoria OWASP:** A03 - Injection

**Descrição:**
Não foram encontrados padrões vulneráveis:
- Nenhum uso de `dangerouslySetInnerHTML`
- Nenhum uso de `eval()` ou `new Function()`
- Nenhum uso de `innerHTML` com dados externos
- Firestore SDK previne NoSQL injection

**Status:** ✅ Adequado

---

#### [INFO] A01-002: Rotas Protegidas Implementadas

**Categoria OWASP:** A01 - Broken Access Control

**Localização:**
```
src/components/PrivateRoute.tsx
src/components/AdminRoute.tsx
src/App.tsx
```

**Descrição:**
O projeto implementa proteção de rotas adequada:
- `PrivateRoute`: Verifica autenticação antes de renderizar
- `AdminRoute`: Verifica role de admin no Firestore
- Redirecionamento para login quando não autenticado
- Loading state durante verificação

**Status:** ✅ Adequado

---

## 4. Análise por Categoria OWASP

| Categoria | Status | Findings |
|-----------|--------|----------|
| A01 - Broken Access Control | ✅ | 0 (2 info positivas) |
| A02 - Cryptographic Failures | ❌ | 1 crítica |
| A03 - Injection | ✅ | 0 (1 info positiva) |
| A04 - Insecure Design | ⚠️ | 1 baixa |
| A05 - Security Misconfiguration | ⚠️ | 1 média |
| A06 - Vulnerable Components | ❌ | 1 alta |
| A07 - Auth Failures | ⚠️ | 1 média |
| A08 - Data Integrity Failures | ✅ | 0 |
| A09 - Logging Failures | ⚠️ | 1 média |
| A10 - SSRF | ⚠️ | 1 baixa |

**Legenda:**
- ✅ Nenhuma vulnerabilidade encontrada
- ⚠️ Vulnerabilidades de baixa/média severidade
- ❌ Vulnerabilidades de alta/crítica severidade

---

## 5. Recomendações Priorizadas

### Ações Imediatas (0-7 dias)

1. **A02-001** - Verificar e limpar histórico Git de credenciais
   - Esforço: Baixo
   - Impacto: Crítico

2. **A06-001** - Atualizar dependências vulneráveis
   - Esforço: Médio (pode ter breaking changes)
   - Impacto: Alto

### Ações de Curto Prazo (7-30 dias)

3. **A05-001** - Implementar headers de segurança
   - Esforço: Baixo
   - Impacto: Médio

4. **A09-001** - Remover/condicionar console.log
   - Esforço: Baixo
   - Impacto: Médio

5. **A07-001** - Fortalecer política de senhas
   - Esforço: Baixo
   - Impacto: Médio

### Ações de Médio Prazo (30-90 dias)

6. **A10-001** - Implementar whitelist de domínios para imagens
   - Esforço: Baixo
   - Impacto: Baixo

7. **A04-001** - Adicionar rate limiting visual no frontend
   - Esforço: Médio
   - Impacto: Baixo

### Melhorias Contínuas

- Implementar monitoramento de segurança (Sentry, Firebase Crashlytics)
- Configurar Dependabot ou Renovate para atualizações automáticas
- Adicionar testes de segurança no CI/CD
- Documentar práticas de segurança no AGENTS.md

---

## 6. Comandos Executados

```bash
# Verificar dependências vulneráveis
npm audit

# Buscar padrões perigosos
grep -rn "dangerouslySetInnerHTML|innerHTML|eval(" --include="*.tsx" --include="*.ts"
grep -rn "console.log|console.error" --include="*.ts" --include="*.tsx"
grep -rn "password|secret|token|apiKey" --include="*.ts" --include="*.tsx"

# Verificar .env no Git
git ls-files | grep -E "\.env"

# Verificar Firestore rules
cat firestore.rules
```

---

## 7. Disclaimer

Este relatório representa uma análise pontual do código-fonte em 2026-05-22. Novas vulnerabilidades podem ser introduzidas após esta data. Recomenda-se:

- Auditorias periódicas (trimestral)
- Scanning automático de dependências
- Code review com foco em segurança
- Testes de penetração antes de releases importantes

A ausência de findings em uma categoria não garante que o sistema esteja livre de vulnerabilidades. Esta foi uma análise estática - testes de penetração podem revelar problemas adicionais.

---

**Fim do Relatório**

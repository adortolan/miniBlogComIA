# 🚀 Quick Start - Configuração CI/CD

## ⚡ Setup Rápido em 5 Passos

### 1️⃣ Configure os Secrets do Firebase

Acesse: `Settings > Secrets and variables > Actions > New repository secret`

**Secrets obrigatórios:**
```
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

**Como obter esses valores:**
```javascript
// Vá para Firebase Console > Project Settings > General
// Role até "Your apps" > SDK setup and configuration
// Copie os valores do firebaseConfig
```

### 2️⃣ Configure a Service Account do Firebase

```bash
# 1. Acesse: Firebase Console > Project Settings > Service Accounts
# 2. Clique em "Generate New Private Key"
# 3. Baixe o arquivo JSON
# 4. Copie TODO o conteúdo do arquivo
# 5. Crie o secret: FIREBASE_SERVICE_ACCOUNT
# 6. Cole o conteúdo JSON completo
```

### 3️⃣ (Opcional) Configure o Codecov

Para relatórios de coverage públicos:

1. Acesse [codecov.io](https://codecov.io)
2. Faça login com GitHub
3. Adicione o repositório
4. Copie o token gerado
5. Adicione como secret: `CODECOV_TOKEN`

**Se não usar Codecov:** A pipeline funciona normalmente, o upload apenas será pulado.

### 4️⃣ Ative o Firebase Hosting

```bash
# No terminal do projeto:
firebase init hosting

# Siga o wizard:
# - Selecione seu projeto
# - Public directory: dist
# - Configure as SPA: Yes
# - Setup automatic builds: No
```

### 5️⃣ Faça o primeiro Push

```bash
git add .
git commit -m "ci: configure GitHub Actions pipelines"
git push origin main
```

## ✅ Verificação

Após o push, verifique:

1. **Actions Tab**: A pipeline deve estar executando
2. **Build Status**: Deve passar com ✅
3. **Coverage Report**: Disponível em Artifacts

## 🎯 Criar seu Primeiro PR

```bash
# Crie uma nova branch
git checkout -b feat/minha-feature

# Faça suas alterações
git add .
git commit -m "feat: add amazing feature"

# Push da branch
git push origin feat/minha-feature

# Abra o PR no GitHub
# A pipeline validará automaticamente!
```

## 🏷️ Padrão de Commits

Use Conventional Commits nos títulos de PR:

```
feat(auth): add Google login
fix(posts): resolve date formatting
docs: update README
test(hooks): add useAuth tests
```

## 🔧 Comandos Úteis

```bash
# Rodar testes localmente
npm test

# Testes com coverage
npm run test:coverage

# Lint
npm run lint

# Build
npm run build
```

## ⚠️ Troubleshooting Rápido

### ❌ Build falha: "Firebase config not found"
**Solução:** Configure os secrets do Firebase (Passo 1)

### ❌ Deploy falha: "Service account error"
**Solução:** Configure FIREBASE_SERVICE_ACCOUNT (Passo 2)

### ❌ PR bloqueado: "Title doesn't follow convention"
**Solução:** Renomeie o PR seguindo o padrão:
```
tipo(escopo): descrição
```

### ❌ Coverage muito baixo
**Solução:** Adicione mais testes. Mínimo requerido: 70%

## 📊 Badges para README

Adicione ao seu README.md:

```markdown
![CI/CD](https://github.com/SEU_USUARIO/miniBlog/workflows/CI%2FCD%20Pipeline/badge.svg)
![Tests](https://github.com/SEU_USUARIO/miniBlog/workflows/Test%20Coverage%20Report/badge.svg)
![CodeQL](https://github.com/SEU_USUARIO/miniBlog/workflows/CodeQL%20Security%20Analysis/badge.svg)
[![codecov](https://codecov.io/gh/SEU_USUARIO/miniBlog/branch/main/graph/badge.svg)](https://codecov.io/gh/SEU_USUARIO/miniBlog)
```

## 🎉 Pronto!

Sua pipeline está configurada! Agora todo push e PR será:
- ✅ Testado automaticamente
- 🔍 Analisado por segurança
- 📊 Verificado coverage
- 🚀 Deploy automático (PRs em preview, main em produção)

## 📚 Documentação Completa

Para mais detalhes: [`.github/PIPELINE_GUIDE.md`](.github/PIPELINE_GUIDE.md)

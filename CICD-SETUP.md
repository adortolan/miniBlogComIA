# 🚀 Setup CI/CD - Mini Blog

Guia simplificado para configurar o pipeline de CI/CD com GitHub Actions.

## 📋 Pré-requisitos

- Conta no GitHub
- Projeto criado no [Firebase Console](https://console.firebase.google.com/)
- Firebase CLI instalado: `npm install -g firebase-tools`

---

## 1️⃣ Configuração do Firebase

### 1.1 Inicializar Firebase no Projeto

```bash
firebase login
firebase init
```

Selecione:
- [x] Firestore

---

## 2️⃣ Configuração dos GitHub Secrets

Vá para **Settings > Secrets and variables > Actions** no GitHub e adicione:

### Secrets Necessários

| Secret | Como Obter |
|--------|------------|
| `VITE_FIREBASE_API_KEY` | Firebase Console > Project Settings > SDK setup |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Console > Project Settings > SDK setup |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Console > Project Settings > SDK setup |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console > Project Settings > SDK setup |
| `VITE_FIREBASE_APP_ID` | Firebase Console > Project Settings > SDK setup |

---

## 3️⃣ Estrutura do Pipeline

O pipeline executa **build & test** automaticamente:

- Checkout do código
- Instala dependências
- Executa lint (ESLint)
- Executa testes unitários
- Build do projeto (Vite)

---

## 4️⃣ Criar Arquivo `.env.local`

Para desenvolvimento local, crie o arquivo `.env.local`:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

⚠️ **IMPORTANTE:** Este arquivo está no `.gitignore` e NÃO deve ser commitado!

---

## 5️⃣ Como Usar

### Testar Localmente

```bash
npm run lint && npm test && npm run build
```

### Criar Pull Request

```bash
git checkout -b feature/nova-funcionalidade
# faça suas alterações
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nova-funcionalidade
```

Abra um PR no GitHub e o pipeline validará automaticamente.

### Merge para Main

```bash
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

O pipeline executará novamente para validar o código.

---

## 6️⃣ Troubleshooting

### ❌ Build Failed - Missing Secrets

**Solução:** Verifique se todos os secrets estão configurados em **Settings > Secrets and variables > Actions**.

---

## 💡 Dicas

- **Nunca commite secrets** - Use sempre GitHub Secrets
- **Teste localmente primeiro** - Execute lint, test e build antes de push
- **PRs pequenos** - Facilitam code review

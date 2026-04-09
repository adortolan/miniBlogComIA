# 📝 Mini Blog - React + Firebase

[![CI/CD Pipeline](https://github.com/seu-usuario/miniBlog/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/seu-usuario/miniBlog/actions/workflows/ci-cd.yml)
[![Firebase Hosting](https://img.shields.io/badge/Firebase-Hosting-orange)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5+-purple)](https://vitejs.dev/)

Aplicação de blog moderno construída com **React**, **Firebase** (Serverless) e **CI/CD** automatizado.

---

## ✨ Features

- 🔐 **Autenticação** com Google (Firebase Auth)
- 📝 **CRUD de Posts** com editor Markdown
- 🏷️ **Sistema de Tags** para organização de conteúdo
- 🖼️ **Imagens via URL** (link externo)
- 🔄 **Real-time Updates** com Firestore
- 🎨 **Interface Moderna** e responsiva
- 🚀 **CI/CD Automatizado** com GitHub Actions
- 🔒 **Regras de Segurança** no Firebase
- 👥 **Sistema de Permissões** (Admin/Reader)

---

## 🏗️ Arquitetura

### Stack Tecnológico

- **Frontend:** React 18 + Vite
- **Backend:** Firebase (Serverless)
  - Firestore (Database NoSQL)
  - Authentication (Google OAuth)
  - Hosting (Deploy)
- **CI/CD:** GitHub Actions
- **Styling:** TailwindCSS / CSS Modules

### Estrutura de Dados (Firestore)

#### Collection: `posts`
```javascript
{
  title: String,
  content: String (Markdown),
  slug: String,
  authorId: String (ref),
  createdAt: Timestamp,
  tags: Array<String>,
  imageURL: String (URL externa)
}
```

#### Collection: `users`
```javascript
{
  displayName: String,
  photoURL: String,
  role: 'admin' | 'reader'
}
```

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Firebase](https://firebase.google.com/)

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/miniBlog.git
cd miniBlog
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie o arquivo `.env.local`:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Execute em desenvolvimento:**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## 📂 Estrutura de Pastas

```
src/
├── components/      # Componentes de UI reutilizáveis
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PostCard.jsx
│   └── PostForm.jsx
├── config/          # Configurações (Firebase)
│   └── firebase.js
├── contexts/        # Context API (Estado global)
│   └── AuthContext.jsx
├── hooks/           # Custom Hooks
│   ├── useAuth.js
│   ├── useFirestore.js
│   └── usePosts.js
├── pages/           # Páginas/Views
│   ├── Home.jsx
│   ├── PostDetail.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── NewPost.jsx
│       └── EditPost.jsx
├── services/        # Serviços/API calls
│   ├── postService.js
│   └── authService.js
├── styles/          # Estilos globais
└── App.jsx          # Componente raiz
```

---

## 🔄 CI/CD Pipeline

### Workflow Automatizado

```mermaid
graph LR
    A[Push/PR] --> B[Lint]
    B --> C[Test]
    C --> D[Build]
    D --> E{Branch?}
    E -->|PR| F[Deploy Preview]
    E -->|develop| G[Deploy Staging]
    E -->|main| H[Deploy Production]
```

### Status Checks

Toda PR passa por:
- ✅ **ESLint** - Qualidade de código
- ✅ **Unit Tests** - Testes automatizados
- ✅ **Build** - Compilação sem erros
- ✅ **Deploy Preview** - Preview temporário

### Ambientes

| Ambiente | Branch | URL | Deploy |
|----------|--------|-----|--------|
| Production | `main` | https://seu-projeto.web.app | Automático |
| Staging | `develop` | https://seu-projeto-staging.web.app | Automático |
| Preview | PRs | URL temporária (7 dias) | Por PR |

📖 **[Guia Completo de Setup CI/CD](CICD-SETUP.md)**

---

## 🌊 GitHub Flow

Este projeto segue o **GitHub Flow** para desenvolvimento:

1. Criar branch a partir da `main`
2. Fazer commits descritivos
3. Abrir Pull Request
4. Code Review
5. CI/CD validação
6. Merge para `main`
7. Deploy automático

📖 **Use a skill:** `/github-flow` para seguir o workflow completo

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Lint

```bash
# Verificar código
npm run lint

# Corrigir automaticamente
npm run lint -- --fix
```

### Build

```bash
# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 📋 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | Executa ESLint |
| `npm test` | Executa testes |
| `firebase deploy` | Deploy manual para Firebase |

---

## 🔒 Segurança

### Firestore Security Rules

- **Posts:** Leitura pública, escrita restrita ao autor/admin
- **Users:** Leitura pública, escrita restrita ao próprio usuário

Ver regras completas em:
- `firestore.rules`

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

**Commits seguem [Conventional Commits](https://www.conventionalcommits.org/):**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas gerais

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 📞 Contato

Criado por **[Seu Nome]** - [@seu-usuario](https://github.com/seu-usuario)

**Deploy:** [https://seu-projeto.web.app](https://seu-projeto.web.app)

---

⭐ **Se este projeto foi útil, deixe uma estrela!**

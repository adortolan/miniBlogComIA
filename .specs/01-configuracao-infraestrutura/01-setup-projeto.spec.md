# 1.1 Setup do Projeto

## Descrição
Inicializar o projeto React com Vite e instalar todas as dependências necessárias para o mini blog.

## Dependências
- Nenhuma (feature inicial)

## Etapas

### Etapa 1 — Criar projeto React com Vite
- Executar `npm create vite@latest mini-blog -- --template react`
- Verificar que a estrutura padrão do Vite foi criada

### Etapa 2 — Instalar dependências do projeto
- `npm install firebase react-router-dom react-markdown`
- Dependências de dev se necessário (ex: `tailwindcss`, `postcss`, `autoprefixer`)

### Etapa 3 — Configurar variáveis de ambiente
- Criar arquivo `.env.local` na raiz do projeto
- Definir variáveis:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- Adicionar `.env.local` ao `.gitignore`

### Etapa 4 — Criar arquivo de configuração do Firebase
- Criar `src/config/firebase.js`
- Importar e inicializar o Firebase App com as variáveis de ambiente
- Exportar instâncias de `auth` e `db` (Firestore)

### Etapa 5 — Organizar estrutura de pastas
- Criar pastas dentro de `src/`:
  - `components/`
  - `config/`
  - `contexts/`
  - `hooks/`
  - `pages/`
  - `services/`
  - `styles/`

## Critérios de Aceite
- [ ] Projeto roda com `npm run dev` sem erros
- [ ] Firebase SDK inicializa sem erros no console
- [ ] Variáveis de ambiente são lidas corretamente via `import.meta.env`
- [ ] Estrutura de pastas está criada conforme `Projeto.md`

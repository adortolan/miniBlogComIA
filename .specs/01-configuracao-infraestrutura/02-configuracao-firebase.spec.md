# 1.2 Configuração do Firebase

## Descrição
Configurar todos os serviços do Firebase necessários no console e no projeto local.

## Dependências
- 1.1 Setup do Projeto

## Etapas

### Etapa 1 — Criar projeto no Firebase Console
- Acessar https://console.firebase.google.com
- Criar novo projeto com nome do blog
- Registrar app web e copiar credenciais

### Etapa 2 — Habilitar Firestore Database
- No console Firebase, ativar Cloud Firestore
- Selecionar modo de produção (regras serão configuradas na feature 1.3)
- Escolher região mais próxima (ex: `southamerica-east1`)

### Etapa 3 — Habilitar Authentication
- No console Firebase, ativar Authentication
- Habilitar provedor **Google** como método de login
- Habilitar provedor **Email/Senha** como método de login

### Etapa 4 — Habilitar Firebase Hosting
- No console Firebase, ativar Hosting
- Instalar Firebase CLI: `npm install -g firebase-tools`
- Executar `firebase init` na raiz do projeto
- Selecionar Hosting e conectar ao projeto criado

### Etapa 5 — Validar conexão local
- Importar `db` e `auth` de `src/config/firebase.js`
- Testar conexão básica (ex: listar coleções ou verificar auth state)

## Critérios de Aceite
- [ ] Firestore, Auth e Hosting estão ativos no console Firebase
- [ ] `firebase.js` exporta instâncias funcionais de `db` e `auth`
- [ ] Firebase CLI está instalado e conectado ao projeto

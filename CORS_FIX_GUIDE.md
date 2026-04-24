# Guia de Correção - Erro de CORS no useRegister

## 🔍 Problema Identificado
Erro de CORS ao criar usuário na linha 26 do `src/hooks/useRegister.js`

## 🎯 Causas Possíveis
1. **Variáveis de ambiente não configuradas** ⚠️ MAIS PROVÁVEL
2. Domínio não autorizado no Firebase Console
3. Regras de segurança do Firestore bloqueando a operação

## ✅ Solução Passo a Passo

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

### 2. Obter Credenciais do Firebase

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. Vá em **Project Settings** (⚙️) > **General**
4. Role até **Your apps** > **SDK setup and configuration**
5. Copie os valores da config e adicione no `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Autorizar Domínios no Firebase Console

1. No Firebase Console, vá em **Authentication**
2. Clique na aba **Settings** > **Authorized domains**
3. Adicione:
   - `localhost`
   - Seu domínio de produção (se aplicável)

### 4. Verificar Regras do Firestore

As regras em `firestore.rules` já estão corretas para permitir criação de usuário:

```javascript
// Linha 38 - permite criar próprio perfil
allow create, update: if isOwner(userId);
```

### 5. Reiniciar o Servidor de Desenvolvimento

Após configurar o `.env`:

```bash
npm run dev
```

## 🧪 Testar a Correção

1. Abra o navegador
2. Tente criar um novo usuário
3. Verifique o console do navegador para erros
4. Se ainda houver erro, compartilhe a mensagem completa

## 📝 Melhorias Implementadas

- ✅ Tratamento específico para erros de CORS
- ✅ Tratamento para erros de permissão do Firestore
- ✅ Logs detalhados no console
- ✅ Campo `createdAt` adicionado ao documento do usuário
- ✅ Melhor cleanup em caso de falha

## 🚨 Se o Erro Persistir

Execute no console do navegador para diagnóstico:

```javascript
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅' : '❌',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅' : '❌'
});
```

## 📚 Recursos
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

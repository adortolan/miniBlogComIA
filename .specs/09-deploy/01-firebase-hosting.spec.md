# 9.1 Firebase Hosting (Deploy)

## Descrição
Configurar e realizar deploy da aplicação no Firebase Hosting.

## Dependências
- 1.2 Configuração do Firebase
- Todas as features implementadas

## Etapas

### Etapa 1 — Instalar Firebase CLI
- `npm install -g firebase-tools`
- Autenticar: `firebase login`

### Etapa 2 — Inicializar Firebase Hosting
- Executar `firebase init hosting`
- Selecionar projeto Firebase existente
- Diretório público: `dist` (output do Vite)
- Configurar como SPA: **Sim** (rewrite all URLs para `index.html`)
- Não sobrescrever `index.html`

### Etapa 3 — Configurar firebase.json
- Verificar/editar `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Etapa 4 — Build de produção
- Executar `npm run build`
- Verificar que a pasta `dist/` é gerada corretamente
- Testar localmente: `firebase serve` ou `firebase emulators:start`

### Etapa 5 — Deploy
- Executar `firebase deploy --only hosting`
- Verificar URL gerada (ex: `https://seu-projeto.web.app`)
- Testar aplicação em produção

### Etapa 6 — (Opcional) CI/CD com GitHub Actions
- Criar `.github/workflows/firebase-hosting.yml`
- Configurar deploy automático em push para `main`
- Usar action `FirebaseExtended/action-hosting-deploy`
- Configurar secrets: `FIREBASE_SERVICE_ACCOUNT`

## Critérios de Aceite
- [ ] Build de produção gerado sem erros
- [ ] Deploy realizado com sucesso no Firebase Hosting
- [ ] Aplicação funciona corretamente na URL de produção
- [ ] SPA routing funciona (rotas diretas não retornam 404)
- [ ] SSL ativo (HTTPS)

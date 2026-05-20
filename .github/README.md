# 🔧 .github Directory

Configuração completa de CI/CD e automação para o projeto MiniBlog.

## 📂 Estrutura

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci-cd.yml          # Pipeline principal
│   ├── pr-validation.yml  # Validação de PRs
│   ├── test-coverage.yml  # Relatórios de coverage
│   ├── dependency-review.yml
│   ├── codeql-analysis.yml
│   └── auto-merge-dependabot.yml
├── dependabot.yml         # Configuração Dependabot
├── pull_request_template.md
├── PIPELINE_GUIDE.md      # 📖 Documentação completa
├── QUICKSTART_CI.md       # 🚀 Início rápido
├── CI_SUMMARY.md          # 📋 Resumo executivo
├── TECHNICAL_NOTES.md     # 🔧 Notas técnicas
└── README.md              # Este arquivo
```

## 📚 Guias de Documentação

### Para Começar
👉 **[QUICKSTART_CI.md](QUICKSTART_CI.md)** - Comece aqui!
- Setup em 5 passos
- Configuração de secrets
- Primeiro PR

### Documentação Completa
📖 **[PIPELINE_GUIDE.md](PIPELINE_GUIDE.md)** - Referência completa
- Todos os workflows explicados
- Troubleshooting detalhado
- Conventional Commits
- Métricas e monitoramento

### Resumo Executivo
📋 **[CI_SUMMARY.md](CI_SUMMARY.md)** - Overview rápido
- O que foi criado
- Checklist de ativação
- Métricas e thresholds
- Badges disponíveis

### Notas Técnicas
🔧 **[TECHNICAL_NOTES.md](TECHNICAL_NOTES.md)** - Detalhes de implementação
- Explicação de warnings
- Estratégias de deploy
- Performance benchmarks
- Configurações avançadas

## 🚀 Workflows

### Principal
- **ci-cd.yml**: Lint → Test → Build → Deploy

### Qualidade
- **pr-validation.yml**: Validação rigorosa de PRs
- **test-coverage.yml**: Relatórios de coverage

### Segurança
- **codeql-analysis.yml**: Security scanning
- **dependency-review.yml**: Review de dependências

### Automação
- **auto-merge-dependabot.yml**: Auto-merge seguro
- **dependabot.yml**: Atualizações automáticas

## ⚙️ Configuração Necessária

### 1. Secrets (Obrigatório)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
FIREBASE_SERVICE_ACCOUNT
```

### 2. Dependências (Instalar)
```bash
npm install
```

### 3. Codecov (Opcional)
```
CODECOV_TOKEN  # Para relatórios públicos
```

## 🎯 Quick Commands

```bash
# Testar localmente
npm test

# Coverage local
npm run test:coverage

# Lint
npm run lint

# Build
npm run build

# Simular CI localmente (usando act)
act -j lint
```

## 📊 Status da Pipeline

Adicione ao README principal:

```markdown
![CI/CD](https://github.com/SEU_USUARIO/miniBlog/workflows/CI%2FCD%20Pipeline/badge.svg)
![Tests](https://github.com/SEU_USUARIO/miniBlog/workflows/Test%20Coverage%20Report/badge.svg)
![CodeQL](https://github.com/SEU_USUARIO/miniBlog/workflows/CodeQL%20Security%20Analysis/badge.svg)
```

## 🔗 Links Úteis

- [GitHub Actions Docs](https://docs.github.com/actions)
- [Vitest Documentation](https://vitest.dev)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Conventional Commits](https://conventionalcommits.org)

## 📞 Suporte

Problemas com a pipeline? Consulte:
1. **[PIPELINE_GUIDE.md](PIPELINE_GUIDE.md)** - Troubleshooting completo
2. **[TECHNICAL_NOTES.md](TECHNICAL_NOTES.md)** - Warnings conhecidos
3. **Actions Tab** - Logs detalhados no GitHub

---

**Versão:** 1.0.0  
**Última atualização:** Abril 2026

# 🔧 Notas Técnicas da Pipeline

## ⚠️ Warnings Esperados

### CODECOV_TOKEN - Context Access Warning
**Status:** ✅ Esperado e Seguro

**Motivo:**  
O GitHub Actions YAML linter avisa sobre `CODECOV_TOKEN` porque é um **secret opcional**. Este warning é esperado e não indica um problema.

**Como funciona:**
```yaml
- name: Upload coverage to Codecov (Optional)
  continue-on-error: true  # ✅ Não quebra se falhar
  with:
    fail_ci_if_error: false  # ✅ Não falha se token ausente
    token: ${{ secrets.CODECOV_TOKEN }}
```

**Comportamento:**
- ✅ **Com token:** Upload para Codecov funciona
- ✅ **Sem token:** Step é ignorado silenciosamente
- ✅ **Pipeline continua:** Em ambos os casos

**Ação necessária:** Nenhuma. Este é o comportamento desejado.

---

## 🔒 Secrets Management

### Hierarquia de Secrets

1. **Repository Secrets** (Configuração padrão)
   - Acessível por todos os workflows
   - Configurado em: `Settings > Secrets and variables > Actions`

2. **Environment Secrets** (Opcional, mais seguro)
   - Específico para ambientes (production, staging)
   - Requer aprovação manual
   - Configurado em: `Settings > Environments`

### Secrets Obrigatórios vs Opcionais

**Obrigatórios (Build quebra sem eles):**
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
FIREBASE_SERVICE_ACCOUNT (apenas para deploy)
```

**Opcionais (Features extras):**
```
CODECOV_TOKEN - Upload de coverage para codecov.io
```

---

## 🚀 Estratégias de Deploy

### Preview Deploys (Pull Requests)
```yaml
if: github.event_name == 'pull_request'
```
- Cria preview temporário (7 dias)
- URL única por PR
- Não afeta produção
- Requer `FIREBASE_SERVICE_ACCOUNT`

### Production Deploys (Branch Main)
```yaml
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```
- Deploy apenas em `main`
- Pode usar environment protection
- URL permanente
- Requer `FIREBASE_SERVICE_ACCOUNT`

---

## 📊 Coverage Configuration

### Vitest Coverage v8
```javascript
coverage: {
  provider: 'v8',  // Escolha: v8 ou istanbul
  reporter: ['text', 'json', 'html', 'lcov', 'json-summary'],
  lines: 70,       // Mínimo 70%
  functions: 70,
  branches: 70,
  statements: 70,
}
```

### Reporters Explicados
- **text:** Output no terminal
- **json:** Dados estruturados
- **html:** Interface visual (coverage/index.html)
- **lcov:** Formato para Codecov/Coveralls
- **json-summary:** Métricas resumidas (usadas na pipeline)

---

## 🤖 Dependabot Best Practices

### Auto-Merge Strategy
```yaml
# Auto-approve: patch + minor
if: steps.metadata.outputs.update-type == 'version-update:semver-patch'

# Manual review: major
if: steps.metadata.outputs.update-type == 'version-update:semver-major'
```

**Raciocínio:**
- **Patch (1.0.x):** Bug fixes, sempre seguro
- **Minor (1.x.0):** Novas features (backward compatible)
- **Major (x.0.0):** Breaking changes, requer review manual

### Grouping Dependencies
```yaml
groups:
  dev-dependencies:
    dependency-type: "development"
```
- Reduz número de PRs
- Agrupa updates relacionados
- Facilita review

---

## 🎯 Workflow Optimization

### Job Dependencies
```yaml
jobs:
  lint:        # Executa primeiro (rápido)
  test:        # Executa após lint
    needs: lint
  build:       # Executa após test e lint
    needs: [lint, test]
  deploy:      # Executa após build
    needs: build
```

**Benefícios:**
- ⚡ Falha rápido (lint antes de test)
- 💰 Economiza compute (não builda se lint falhar)
- 🔄 Paralelização onde possível

### Caching Strategy
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Cacheia node_modules
```

**Impacto:**
- ⏱️ Reduz tempo de install de ~2min para ~20s
- 💾 Cache compartilhado entre jobs
- 🔄 Invalidado automaticamente ao mudar package-lock.json

---

## 🔍 CodeQL Configuration

### Scan Schedule
```yaml
schedule:
  - cron: '0 6 * * 1'  # Segunda 6h UTC
```

**Motivo:**
- 🔒 Security scan regular
- 🕐 Horário de baixo uso
- 📊 Detecta novas vulnerabilidades CVE

### Query Suites
```yaml
queries: security-extended,security-and-quality
```

**Níveis:**
- `security-extended`: Todas as vulnerabilidades de segurança
- `security-and-quality`: + code smells e bugs

---

## 📦 Artifacts Management

### Retention Policies
```yaml
retention-days: 7   # Build artifacts
retention-days: 30  # Coverage reports
```

**Raciocínio:**
- Builds: Curta duração (produção já deployada)
- Coverage: Longa duração (análise histórica)

### Artifact Size
- **Build (dist/):** ~2-5 MB comprimido
- **Coverage:** ~500 KB - 2 MB
- **ESLint reports:** ~10-50 KB

---

## 🔐 Security Hardening

### Permissions Principle
```yaml
permissions:
  contents: read      # Mínimo necessário
  pull-requests: write  # Apenas onde precisa
```

**OWASP Best Practice:**
- ✅ Least privilege principle
- ✅ Explicit permissions
- ✅ Auditável

### Secret Scanning
```bash
grep -rn "FIREBASE\|API_KEY\|SECRET" src/ | grep -v "process.env"
```
- Detecta hardcoded secrets
- Exclui uso correto (`process.env`)
- Falha pipeline se detectar

---

## 📈 Performance Benchmarks

### Tempos Esperados (Ubuntu Latest)
- **Lint:** ~30s - 1min
- **Tests:** ~1-3min (depende do número de testes)
- **Build:** ~1-2min
- **Coverage:** +30s no test
- **Deploy:** ~2-3min

### Total Pipeline (sem deploy)
- **✅ Sucesso:** ~5-7min
- **❌ Falha lint:** ~1min (fail fast)
- **❌ Falha test:** ~2-3min

---

## 🎨 Conventional Commits Regex

```javascript
/^(feat|fix|docs|style|refactor|perf|test|chore|ci)(\(.+\))?: .{1,100}/
```

**Validação:**
- ✅ `feat(auth): add login`
- ✅ `fix: resolve bug`
- ❌ `add login` (sem tipo)
- ❌ `feat add login` (falta `:`)

---

## 🔄 Continuous Improvement

### Métricas a Monitorar
1. **Build success rate** (target: >95%)
2. **Average build time** (target: <10min)
3. **Test coverage trend** (target: crescente)
4. **Security vulnerabilities** (target: 0 high/critical)

### Ajustes Futuros
- [ ] Adicionar E2E tests (Playwright)
- [ ] Implementar visual regression testing
- [ ] Configurar performance budgets
- [ ] Adicionar lighthouse CI

---

## 📚 Referências Técnicas

- [GitHub Actions Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Vitest Coverage Guide](https://vitest.dev/guide/coverage.html)
- [Firebase Hosting Deploy](https://firebase.google.com/docs/hosting/github-integration)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OWASP CI/CD Security](https://owasp.org/www-project-devsecops-guideline/)

---

## 🆘 Troubleshooting Avançado

### Pipeline lenta
```bash
# Verificar cache hits
- run: du -sh ~/.npm

# Verificar node_modules
- run: du -sh node_modules
```

### Out of memory
```yaml
env:
  NODE_OPTIONS: --max-old-space-size=4096
```

### Timeout em testes
```javascript
// vitest.config.js
test: {
  testTimeout: 10000,  // 10s por teste
}
```

---

**Última atualização:** 2026-04-24  
**Versão da pipeline:** 1.0.0

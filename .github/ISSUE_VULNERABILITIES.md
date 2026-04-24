# Issue: Atualizar Dependências com Vulnerabilidades

## 🔒 Descrição

Foram detectadas 16 vulnerabilidades nas dependências do projeto via `npm audit`. A maioria está em **devDependencies** e não afeta produção.

## 📊 Vulnerabilidades Detectadas

### **1. esbuild (Moderate - 14 vulnerabilities)**
- **Severidade**: Moderate
- **Pacotes afetados**: `vite`, `vitest`, `@vitest/coverage-v8`
- **Versão atual**: vite@4.4.9
- **Fix requer**: vite@8.0.10 ⚠️ **BREAKING CHANGE**
- **Impacto**: Development only

### **2. happy-dom (Critical - 1 vulnerability)**
- **Severidade**: Critical
- **Vulnerabilidades**:
  - Execução de código server-side via `<script>`
  - VM Context Escape → Remote Code Execution
  - Problema com cookies
- **Versão atual**: happy-dom@12.10.3
- **Fix requer**: happy-dom@20.9.0 ⚠️ **BREAKING CHANGE**
- **Impacto**: Development/Testing only

### **3. undici (High - 1 vulnerability)**
- **Severidade**: High
- **Pacotes afetados**: Firebase e todos os submódulos
- **Status**: Aguarda atualização do Firebase
- **Impacto**: Firebase dependency

## ⚠️ Análise de Risco

- ✅ **Produção NÃO afetada** (são devDependencies)
- ⚠️ **Atualizações são BREAKING CHANGES**
- ⚠️ **Requer testes extensivos**

## 🎯 Plano de Ação

### **Fase 1: Preparação** (Recomendado agora)
- [ ] Criar branch `feat/update-dependencies`
- [ ] Atualizar happy-dom isoladamente
  ```bash
  npm install -D happy-dom@latest
  npm test
  ```

### **Fase 2: Atualização Vite** (Cuidado!)
- [ ] Estudar breaking changes do Vite 5.x, 6.x, 7.x, 8.x
- [ ] Atualizar configurações
- [ ] Testar build e dev server
  ```bash
  npm install -D vite@latest vitest@latest @vitest/coverage-v8@latest
  npm run build
  npm run dev
  npm test
  ```

### **Fase 3: Firebase** (Aguardar)
- [ ] Monitorar releases do Firebase
- [ ] Atualizar quando disponível

## 📝 Comandos Úteis

```bash
# Ver vulnerabilidades
npm audit

# Tentar fix automático (sem breaking changes)
npm audit fix

# Fix completo (CUIDADO!)
npm audit fix --force

# Atualizar package específico
npm install -D <package>@latest
```

## 🔗 Referências

- [Vite Migration Guide](https://vitejs.dev/guide/migration.html)
- [Vitest Migration](https://vitest.dev/guide/migration.html)
- [Happy DOM Releases](https://github.com/capricorn86/happy-dom/releases)

## ✅ Critérios de Aceitação

- [ ] Todas as vulnerabilidades resolvidas ou justificadas
- [ ] Testes 100% passando
- [ ] Build funcionando
- [ ] Dev server funcionando
- [ ] Sem regressões

---

**Prioridade**: Medium  
**Labels**: dependencies, security, devDependencies  
**Milestone**: v0.2.0

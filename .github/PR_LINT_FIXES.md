# PR: Correção de Erros de Lint e Warnings

## 📋 Resumo

Corrige todos os 11 erros de lint e warnings detectados pelo ESLint, melhorando a qualidade do código e a arquitetura do projeto.

## 🔧 Alterações Realizadas

### **Configuração**
- ✅ Adiciona `coverage/` ao `ignorePatterns` do ESLint
- ✅ Corrige uso de `__dirname` em ES modules (vitest.config.js)
- ✅ Adiciona dependência `prop-types`

### **Componentes e Contexts**
- ✅ Adiciona validação de PropTypes em `AuthProvider`
- ✅ Move `useAuthContext` para arquivo separado (`hooks/useAuthContext.js`)
- ✅ Melhora arquitetura separando hook do provider (melhor prática React)

### **Testes**
- ✅ Adiciona `beforeEach` aos imports do vitest
- ✅ Remove parâmetros não utilizados em mocks
- ✅ Remove imports não utilizados
- ✅ Atualiza mocks para nova estrutura de hooks

## ✅ Validações

### **Lint**
```bash
npm run lint
# ✅ 0 erros, 0 warnings
```

### **Testes**
```bash
npm test
# ✅ 41 testes passando (6 arquivos)
# ✅ 100% de sucesso
```

## 📊 Commits

1. **71b9ad9** - `fix: corrige todos os erros de lint e warnings`
2. **3381959** - `test: atualiza mocks para usar novo caminho do hook useAuthContext`

## 🎯 Impacto

- ✅ **Sem breaking changes**
- ✅ **Todos os testes passando**
- ✅ **Código mais limpo e organizado**
- ✅ **Melhor arquitetura (hooks separados)**

## 📝 Checklist

- [x] Código sem erros de lint
- [x] Todos os testes passando
- [x] PropTypes adicionados
- [x] Imports otimizados
- [x] Arquitetura melhorada
- [x] Documentação atualizada

## 🔗 Issues Relacionadas

Closes #[número_da_issue_de_lint]

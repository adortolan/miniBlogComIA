# 🚀 Guia de Pipeline CI/CD

## 📋 Visão Geral

Este projeto possui uma pipeline de CI/CD completa e automatizada usando GitHub Actions. A pipeline garante qualidade de código, segurança e deploy automatizado.

## 🔄 Workflows Disponíveis

### 1. **CI/CD Pipeline** (`ci-cd.yml`)
Pipeline principal que executa em todos os pushes e PRs.

**Jobs:**
- 🔍 **Lint**: Validação de código com ESLint
- 🧪 **Test**: Execução de testes unitários com cobertura
- 🏗️ **Build**: Compilação do projeto
- 🚀 **Deploy Preview**: Deploy automático em PRs (ambiente de preview)
- 🌐 **Deploy Production**: Deploy em produção (apenas branch `main`)

**Triggers:**
- Push nas branches `main` e `develop`
- Pull Requests para `main` e `develop`
- Execução manual via workflow_dispatch

### 2. **PR Validation** (`pr-validation.yml`)
Validações adicionais para Pull Requests.

**Verificações:**
- ✅ Título do PR segue Conventional Commits
- ⚠️ Conflitos de merge
- 📁 Tamanho de arquivos (limite: 500KB)
- 🎯 Qualidade de código
- 📋 Comentários TODO/FIXME
- 🔒 Hardcoded secrets
- 📦 Análise de tamanho do bundle

### 3. **Dependency Review** (`dependency-review.yml`)
Análise de dependências quando `package.json` ou `package-lock.json` são modificados.

**Features:**
- 🔍 Revisão de segurança de novas dependências
- 🛡️ Audit de vulnerabilidades conhecidas
- 📦 Lista de pacotes desatualizados

### 4. **CodeQL Analysis** (`codeql-analysis.yml`)
Análise de segurança estática do código.

**Execução:**
- Push nas branches `main` e `develop`
- Pull Requests
- Toda segunda-feira às 6h UTC (scan agendado)

## 🔧 Configuração Necessária

### Secrets do GitHub

Configure os seguintes secrets no repositório (`Settings > Secrets and variables > Actions`):

#### Firebase (Obrigatório para Build e Deploy)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
FIREBASE_SERVICE_ACCOUNT
```

#### Como obter FIREBASE_SERVICE_ACCOUNT:
```bash
# 1. Vá para Firebase Console > Project Settings > Service Accounts
# 2. Clique em "Generate New Private Key"
# 3. Copie todo o conteúdo do arquivo JSON
# 4. Cole no secret FIREBASE_SERVICE_ACCOUNT
```

### Environments (Opcional mas Recomendado)

Configure um environment chamado `production`:
1. Vá em `Settings > Environments > New environment`
2. Nome: `production`
3. Configure proteções:
   - ✅ Required reviewers (requer aprovação antes do deploy)
   - ✅ Deployment branches (apenas `main`)

## 📊 Coverage Report

A pipeline gera relatórios de cobertura de testes:
- Disponível como artefato em cada execução
- Resumo exibido no GitHub Actions Summary
- Retention: 30 dias

### Visualizar Coverage:
1. Acesse a execução do workflow
2. Vá em "Artifacts"
3. Baixe `coverage-report`

## 🎯 Conventional Commits

Os títulos de PRs devem seguir o padrão:

```
<type>(<scope>): <description>

Exemplos:
feat(auth): add Google login
fix(posts): resolve pagination bug
docs: update README
refactor(hooks): optimize useAuth hook
test(components): add Button tests
```

**Types permitidos:**
- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta lógica)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Adição/modificação de testes
- `chore`: Tarefas de manutenção
- `ci`: Mudanças em CI/CD

## 🚦 Status Badges

Adicione ao README.md:

```markdown
![CI/CD](https://github.com/SEU_USUARIO/miniBlog/workflows/CI%2FCD%20Pipeline/badge.svg)
![CodeQL](https://github.com/SEU_USUARIO/miniBlog/workflows/CodeQL%20Security%20Analysis/badge.svg)
```

## 🔍 Troubleshooting

### Build falha por falta de secrets
**Problema:** Build falha com erro relacionado a variáveis de ambiente.
**Solução:** Configure todos os secrets do Firebase listados acima.

### Testes falham no CI mas passam localmente
**Problema:** Diferenças no ambiente de execução.
**Solução:** 
- Verifique se todas as dependências estão no `package.json`
- Execute `npm ci` localmente (limpa node_modules)
- Verifique variáveis de ambiente

### Deploy Preview não funciona
**Problema:** Firebase Hosting Deploy falha.
**Solução:**
- Verifique se `FIREBASE_SERVICE_ACCOUNT` está configurado
- Certifique-se de que o Firebase Hosting está habilitado no projeto
- Verifique as permissões da service account

### PR Validation bloqueia merge
**Problema:** Validações falham mesmo com código correto.
**Solução:**
- **Título do PR**: Siga o padrão Conventional Commits
- **Merge conflicts**: Faça rebase com a branch base
- **Large files**: Otimize arquivos >500KB ou use Git LFS
- **Hardcoded secrets**: Remova qualquer secret hardcoded

## 📈 Métricas e Monitoramento

### Visualizar métricas:
1. Vá em `Actions` no repositório
2. Selecione o workflow desejado
3. Clique em uma execução para ver detalhes

### Principais métricas:
- ⏱️ Tempo de execução de cada job
- ✅ Taxa de sucesso dos builds
- 📊 Cobertura de testes
- 🔒 Vulnerabilidades encontradas
- 📦 Tamanho do bundle

## 🎨 Customização

### Adicionar novos steps:
Edite os arquivos em `.github/workflows/` e adicione steps conforme necessário.

### Modificar triggers:
Ajuste a seção `on:` em cada workflow.

### Adicionar novos checks:
Crie um novo arquivo `.yml` em `.github/workflows/`.

## 📚 Recursos Adicionais

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Firebase Hosting Deploy Action](https://github.com/FirebaseExtended/action-hosting-deploy)
- [CodeQL](https://codeql.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
